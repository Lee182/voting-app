var express = require('express')
var app = express()
var http = require('http')
var path = require('path')
var server = http.Server(app)

var wsServer = require('uws').Server
// var io = require('socket.io')(server)
// io.engine.ws = new (require('uws').Server)({
//   noServer: true,
//   perMessageDeflate: false
// })
var port = process.env.PORT || 3000
var dao = require('./dao')

dao.connect().then(function(){
  // return dao.db.collection('polls').remove({})
})

var wss = new wsServer({
  server: server,
  clientTracking: true,
  perMessageDeflate: false
})

wss.on('connection', function(ws){
  console.log('ws:', wss.clients.length)
  ws.on('message', function(txt){
    ws.send(txt)
  })
  ws.on('close', function(){
    console.log('ws:', wss.clients.length)
  })
})

// var ws_clients_count = 0
// io.on('connection', function(ws) {
//   ws_clients_count++
//   io.emit('ws_clients_count', ws_clients_count)
//
//   ws.on('disconnect', function(){
//     ws_clients_count--
//   })
//
//   var the_cookie = ws.handshake.headers.cookie
//   ws.on('test', function(){
//     console.log('ws test')
//   })
//   ws.on('run', function(o) {
//     console.log(the_cookie)
//     if (o.data.poll_id) {
//       o.data.poll_id = dao.ObjectId(o.data.poll_id)
//     }
//     dao[o.cmd](o.data).then(function(res){
//       o.res = res
//       // res.poll.date = Date.now()
//       ws.emit('run', o)
//     })
//   })
// })
app.use('/', express.static( path.resolve(__dirname + '/../dist') ))

server.listen(port, function(){
  console.log('server listening at http://localhost:'+port)
})
