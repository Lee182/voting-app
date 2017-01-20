io = require('socket.io-client')

module.exports = function({data}){

  var ws = io('http://' + document.domain + ':3000')
  ws.on('connect', function(e){
    _ws_status()
  })

  ws.on('disconnect', function(e){
    _ws_status()
  })

  ws.on('run', function(res){
    console.log('ws run', res)
  })

  w.on('unload', function(){
    ws.disconnect()
  })
  function _ws_status(){
    console.log('ws.connected', ws.connected)
    data.ws_state = ws.connected
    data.ws_status = (ws.connected === true) ? 'connected' : 'disconnected'
  }
  _ws_status()
  return ws
}






/*

// create poll
ws.emit('run', {
  cmd: 'poll_create',
  data: {
    poll: {
      question: 'Whats your favourite color',
      user_id: 'dave',
      options: ['red', 'yellow', 'green']
    }
  }
})


// add option
ws.emit('run',{
  cmd: 'poll_option_add',
  data: {
    option: {
      option: 'blue',
      user_id: 'dave'
    },
    poll_id: app.polls[0]._id
  }
})

*/
