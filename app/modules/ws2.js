var isJSON = require('../browser+node/isJSON.js')

// connect to the server
var ws = new WebSocket(`ws://${document.domain}:3000`)

// event connect
ws.onopen = function(e) {}

// event disconnect
ws.onclose = function(e) {}

// event messages
ws.onmessage = function(e) {}

// ws.readyState number state from this array
var ws_readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED']


// events via ws
ws_sendJSON = function(name, data) {
  if (typeof name !== 'string') {return}
  if (isJSON(obj) === false) {return}
  var json = JSON.stringify([
    name, // [0] eventname
    data  // [1] obj
  ])
  ws.send( json  )
  // TODO server detect json message
}

ws_message_cb_json = function(e){
  if (e.type !== 'message' || isJSON(e.data) !== true) {return}
  var data = JSON.parse(e.data)
  // TODO event onjson function
}


// req/res via ws
var _ws_reqs = {}
var _ws_proms = {}

function randstr_id(){
  return Date.now()+'-'+Math.floor(Math.random()*100000)
}

ws_req = function(o) {
  return new Promise(function(resolve){
    o.reqtoken = randstr_id()
    o.d = Date.now()
    _ws_reqs[o.reqtoken] = o
    _ws_proms[o.reqtoken] = resolve
    methods.ws_sendJSON('run', o)
  })
}

ws_res = function(res){
  var req = _ws_reqs[res.reqtoken]
  var resolve = _ws_proms[res.reqtoken]
  if (req === undefined && resolution === undefined) {return}

  resolve({req, res, d: (Date.now() - req.d) + 'ms'})

  delete _ws_reqs[res.reqtoken]
  delete _ws_proms[res.reqtoken]
}
