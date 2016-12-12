var express = require('express')
var app = express()
var http = require('http')
var server = http.Server(app)
var io = require('socket.io')(server)
io.engine.ws = new (require('uws').Server)({
  noServer: true,
  perMessageDeflate: false
})
var port = process.env.PORT || 3000
var dao = require('./dao')

dao.connect().then(function(){
  return dao.db.collection('polls').remove({})
})

io.on('connection', function(ws) {
  var the_cookie = ws.handshake.headers.cookie
  ws.emit('event', { hello: 'world!!' })

  ws.on('run', function(data) {
    console.log(the_cookie)
    dao[data.cmd](data.data).then(function(res){
      console.log(res)
      res.poll.date = Date.now()
      ws.emit('poll', res.poll)
    })
  })
})

app.use('/', express.static(__dirname + '/dist'))

server.listen(port, function(){
  console.log('server listening at http://localhost:'+port)
})
