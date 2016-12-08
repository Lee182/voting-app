var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var port = process.env.PORT || 3000

io.on('connection', function (socket) {
  console.log(client.headers['cookie'])
  socket.emit('news', { hello: 'world' })
  socket.on('my other event', function(data) {
    console.log(data)
  })
})

app.use('/', express.static(__dirname + '/dist'))

server.listen(port, function(){
  console.log('server listening at http://localhost:'+port)
})
