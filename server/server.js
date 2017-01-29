var express = require('express')
var app = express()
var http = require('http')
var path = require('path')
var server = http.Server(app)

var wsServer = require('uws').Server
var io = require('socket.io')(server)
io.engine.ws = new (require('uws').Server)({
  noServer: true,
  perMessageDeflate: false
})
var port = process.env.PORT || 3000
var dao = require('./dao')
var vote_tools = require('./dao/vote_tools.js')


dao.connect()

var ws_clients_count = 0
io.on('connection', function(ws) {
  ws_clients_count++
  io.emit('ws_clients_count', ws_clients_count)
  ws.on('disconnect', function(){
    ws_clients_count--
  })

  var the_cookie = ws.handshake.headers.cookie
  ws.on('test', function(){
    console.log('ws test')
  })
  ws.on('run', function(o) {
    if (o.data === undefined) {return}
    if (o.data.poll_id !== undefined) {
      o.data.poll_id = dao.ObjectId(o.data.poll_id)
    }
    o.data.ip = ws.handshake.address

    // TODO get user_id from session store
    var user_id = 'davee'

    dao[o.cmd](o.data).then(function(res){
      if (res.poll) {
        res.poll.id = res.poll._id.toString()
        var votes = res.poll.votes
        res.poll.votes = vote_tools.aggregate(votes)
        res.poll.votes.user_id = vote_tools.has_user_id(votes, user_id)
        res.poll.votes.ip = vote_tools.has_ip(votes, o.data.ip)
        delete res.poll._id
        if (res.poll.votes.user_id === undefined) {
          res.poll.votes.user_id = {}
        }
        if (res.poll.votes.ip === undefined) {
          res.poll.votes.ip = {}
        }
      }
      delete o.data
      o.res = res
      ws.emit('run', o)
    })
  })
})
app.use('/', express.static( path.resolve(__dirname + '/../dist') ))

server.listen(port, function(){
  console.log('server listening at http://localhost:'+port)
})








//
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
