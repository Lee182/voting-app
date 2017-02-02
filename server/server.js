var express = require('express')
var app = express()
var http = require('http')
var path = require('path')
var server = http.Server(app)
var CookieParser = require('cookie-parser')

var cookie_parse = CookieParser()
function cook_p(req) {
  return new Promise(function(resolve){
    // req.headers.cookie
    cookie_parse(req, {}, function(){
      resolve(req.cookies)
    })
  })
}
app.use(cookie_parse)


var wsServer = require('uws').Server
var io = require('socket.io')(server)
io.engine.ws = new (require('uws').Server)({
  noServer: true,
  perMessageDeflate: false
})
var port = process.env.PORT || 3000
var dao = require('./dao')
var vote_tools = require('./dao/vote_tools.js')


app.use('/', express.static( path.resolve(__dirname + '/../dist') ))
require('./twitter-session')(app, dao, port)

app.get('/polls/:poll_id', function(req,res){
  res.sendFile(path.resolve(__dirname + '/../dist/index.html'))
})

dao.connect()


var ws_clients_count = 0
io.on('connection', function(ws) {
  // on connection
  ws_clients_count++
  io.emit('ws_clients_count', ws_clients_count)

  // user_id authentication
  var user_id = undefined
  var ip = ws.handshake.address
  cook_p(ws.handshake).then(function(cookie){
    // console.log(cookie)
    if (cookie.twitter === undefined) {return}
    dao.db.collection('polls_sessions')
      .findOne({_id: cookie.twitter})
      .then(function(result){
        if (result === null) {return}
        user_id = result.user_id
        ws.emit('test', {user_id, ip})
      })
  })

  ws.on('test', function(o){
    ws.emit('test',{user_id, ip})
  })

  ws.on('logout', function(){
    user_id = undefined
    ws.emit('test', {user_id, ip})
  })

  ws.on('run', function(o) {
    if (o.data === undefined) {return}
    if (o.data.poll_id !== undefined) {
      o.data.poll_id = dao.ObjectId(o.data.poll_id)
    }
    o.data.ip = ip

    dao[o.cmd](o.data).then(function(res){
      if (res.poll) {
        res.poll = poll_server_map(res.poll, user_id, o.data.ip)
      }
      if (res.polls) {
        res.polls = res.polls.map(function(poll){
          return poll_server_map(poll, user_id, o.data.ip)
        })
      }
      delete o.data
      o.res = res
      ws.emit('run', o)
    })
  })


  ws.on('disconnect', function(){
    ws_clients_count--
    io.emit('ws_clients_count', ws_clients_count)
  })


})

function poll_server_map(poll, user_id, ip) {
  poll.id = poll._id.toString()
  var votes = poll.votes
  poll.votes = vote_tools.aggregate(votes)
  if (user_id !== undefined) {
    poll.votes.user_id = vote_tools.has_user_id(votes, user_id)
  }
  if (user_id === undefined){
    poll.votes.ip = vote_tools.has_ip(votes, ip)
  }

  delete poll._id
  if (poll.votes.user_id === undefined) {
    poll.votes.user_id = {}
  }
  if (poll.votes.ip === undefined) {
    poll.votes.ip = {}
  }
  return poll
}



server.listen(port, function(){
  console.log('server listening at http://localhost:'+port)
})









// var wss = new wsServer({
//   server: server,
//   clientTracking: true,
//   perMessageDeflate: false
// })

// wss.on('connection', function(ws){
//   console.log('ws:', wss.clients.length)
//   ws.on('message', function(txt){
//     ws.send(txt)
//   })
//   ws.on('close', function(){
//     console.log('ws:', wss.clients.length)
//   })
// })
