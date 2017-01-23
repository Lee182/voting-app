// io = require('socket.io-client')
w.isJSON = require('../browser+node/isJSON.js')

module.exports = function({data, methods, computed}){
  data.ws_connected = false
  data.ws_clients_count = 0

  computed.ws_status = function() {
    let vm = this
    if (vm.ws_connected === false) {
      return 'ws offline'
    }
    return `${vm.ws_clients_count} comms`
  }

  // var ws = io('http://' +  + ':3000')
  var ws = new WebSocket(`ws://${document.domain}:3000`)
  var ws_readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED']

  methods.ws_run = function(o) {
    // req/res in ws
    return new Promise(function(resolve){
      o.reqtoken = randstr_id()
      o.d = Date.now()
      _ws_run_reqs[o.reqtoken] = o
      _ws_run_resolutions[o.reqtoken] = resolve
      methods.ws_sendJSON('run', o)
    })
  }
  methods.ws_sendJSON = function(name, obj) {
    if (typeof name !== 'string') {return}
    if (isJSON(obj) === false) {return}
    var str = JSON.stringify({
      e: name,
      d: obj
    })
    ws.send( str  )
  }

  function _ws_status(e){
    data.ws_connected = ws.readyState === 1
    console.log('ws %s', ws_readyStates[ws.readyState])
    // console.log(e)
    if (e.type !== 'message' || isJSON(e.data) !== true) {
      return
    }
    var msg = JSON.parse(e.data)
    if (msg.e === 'run'){
      run_response(msg.d)
    }
  }
  // vm.ws_sendJSON('hello', {what: 'the hell'})

  ws.on('open', _ws_status)
  ws.on('close', _ws_status)
  ws.on('message', _ws_status)

  // ws.on('ws_clients_count', function(e){
  //   data.ws_clients_count = e
  // })
  w.on('unload', function(){
    // when browser closing tab
    ws.close()
  })

  var _ws_run_reqs = {}
  var _ws_run_resolutions = {}
  function randstr_id(){
    return Date.now()+'-'+Math.floor(Math.random()*100000)
  }
  function run_response(res){
    var req = _ws_run_reqs[res.reqtoken]
    var resolution = _ws_run_resolutions[res.reqtoken]
    if (req === undefined && resolution === undefined) {return}

    resolution({req, res, d: (Date.now() - req.d) + 'ms'})

    delete _ws_run_reqs[res.reqtoken]
    delete _ws_run_resolutions[res.reqtoken]
  }


  w.ws = ws
}






/*

vm.ws_run({
  cmd: 'poll_create',
  data: {
    poll: {
      question: 'Whats your favourite color',
      user_id: 'dave',
      options: ['red', 'yellow', 'green']
    }
  }
}).then(function(a){
  console.log(a)
})

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
