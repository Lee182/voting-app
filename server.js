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

io.on('connection', function(ws) {
  var the_cookie = ws.handshake.headers.cookie
  ws.emit('news', { hello: 'world' })
  ws.on('hi', function(data) {
    console.log(data)
  })
})

app.use('/', express.static(__dirname + '/dist'))

server.listen(port, function(){
  console.log('server listening at http://localhost:'+port)
})
