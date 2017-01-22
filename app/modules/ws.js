io = require('socket.io-client')

module.exports = function({data, watch, computed}){
  data.ws_connected = false
  data.ws_clients_count = 0

  computed.ws_status = function() {
    let vm = this
    if (vm.ws_connected === false) {
      return 'ws offline'
    }
    return `${vm.ws_clients_count} comms`
  }

  var ws = io('http://' + document.domain + ':3000')
  function _ws_status(){
    data.ws_connected = ws.connected
  }
  ws.on('connect', _ws_status)
  ws.on('disconnect', _ws_status)
  ws.on('ws_clients_count', function(e){
    data.ws_clients_count = e
  })

  ws.on('run', function(res){
    console.log('ws run', res)
  })
  w.on('unload', function(){
    // when browser closing tab
    ws.disconnect()
  })
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
