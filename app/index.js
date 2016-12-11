window.ws = require('socket.io-client')('http://localhost:3000')
ws.on('connect', function(e){
  console.log('connect', 1, e)
})
ws.on('event', function(data){
  console.log('event', 2, data)
})
ws.on('disconnect', function(e){
  console.log('disconnect', 3, e)
})
