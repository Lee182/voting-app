io = require('socket.io-client')

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
  var urlstr = location.protocol + '//' + document.domain
  if (location.port !== '') {urlstr += ':'+location.port}
  console.log(urlstr)
  var ws = io(urlstr)
  function _ws_status(){
    data.ws_connected = ws.connected
  }
  ws.on('connect', _ws_status)
  ws.on('disconnect', _ws_status)
  ws.on('ws_clients_count', function(e){
    data.ws_clients_count = e
  })
  w.on('unload', function(){
    // when browser closing tab
    ws.disconnect()
  })

  var _ws_run_reqs = {}
  var _ws_run_resolutions = {}
  function randstr_id(){
    return Date.now()+'-'+Math.floor(Math.random()*100000)
  }
  methods.ws_run = function(o) {
    return new Promise(function(resolve){
      o.reqtoken = randstr_id()
      o.d = Date.now()
      _ws_run_reqs[o.reqtoken] = o
      _ws_run_resolutions[o.reqtoken] = resolve
      ws.emit('run', o)
    })
  }
  ws.on('test', function(o){
    console.log(o)
    data.user_id = o.user_id
    data.ip = o.ip
  })

  methods.ws_logout = function(o){
    let vm = this
    vm.user_id = undefined
    w.postJSON({
      url: '/twitter-logout',
      data: {},
      cb: function(){
        console.log("cb")
        ws.emit('logout')
      },
      cookies: true
    })
  }

  ws.on('run', function(res){
    var req = _ws_run_reqs[res.reqtoken]
    var resolution = _ws_run_resolutions[res.reqtoken]
    if (req === undefined && resolution === undefined) {return}

    resolution({req, res: res.res, d: Date.now() - req.d})

    delete _ws_run_reqs[res.reqtoken]
    delete _ws_run_resolutions[res.reqtoken]
  })



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
