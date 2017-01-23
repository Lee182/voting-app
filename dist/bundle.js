(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function isJSON(o) {
  try {
    JSON.stringify(o)
  } catch(e) {
    return false
  }
  return true
}

},{}],2:[function(require,module,exports){
function flatten(arr) {
  var ans = []
  arr.forEach(function(ar){
    if ( Array.isArray(ar) ) { ans = ans.concat( flatten(ar) ) }
    else { ans.push(ar) }
  })
  return ans
}
function namespaceErr(name){return function(err) {
  err = JSON.parse(JSON.stringify(err))
  err.field =  name+'.'+err.field
  return err
}}

function arr_typevalid(fieldname, validators) {return function(arr){
  if (Array.isArray(arr) !== true) {
    return [{
      field: fieldname,
      msg: fieldname +' input isnt an array',
      input: arr
    }]
  }
  return flatten(arr.map(function(option, i){
    return Object.keys(validators).map(function(name){
      if (name === '{}') { // denotes root and not property
        return validators[name](option)
      }
      return validators[name](option[name])
    }).map(function(err){
      err.i = i
      return err
    })
  }) )
}}
function obj_typevalid(fieldname, validators) {return function(obj) {
  // validators is an obj of functions
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return [{
      field: fieldname,
      msg: fieldname + ' input isnt a object.',
      input: obj
    }]
  }
  return flatten(Object.keys(validators).map(function(name){
    return validators[name]( obj[name] )
  }) ).map(namespaceErr('option'))
}}

// validators
// each validator will return array of errs
v = {}

// primitive validations
v.user_id = function(str) {
  var errs = []
  if (typeof str !== 'string'){
    errs.push({
      field: 'user_id',
      value: 'user_id isnt a string',
      input: str
    })
  }
  else if (str.length <= 0) {
    errs.push({
      field: 'user_id',
      msg: 'user_id is small',
      input: str
    })
  }
  return errs
},
v.creation_date = function(date) {
  var errs = []
  if ((new Date(date)).toString() === 'Invalid Date' ) {
    errs.push({
      field: 'creation_date',
      msg: 'invalid date',
      input: date
    })
  }
  return errs
}
v.option_str = function(str) {
  var errs = []
  if (typeof str !== 'string') {
    errs.push({
      field: 'option_str',
      msg: 'option isnot a string',
      input: str
    })
  }
  if (str === '') {
    errs.push({
      field: 'option_str',
      msg: 'option is blank',
      input: str
    })
  }
  return errs
}
v.question = function(str){
  var errs = []
  if (typeof str !== 'string') {
    errs.push({
      field: 'question',
      msg: 'question isnot a string',
      input: str
    })
  }
  else if (str.split(' ').join('').length <= 8) {
    errs.push({
      field: 'question',
      msg: 'question needs more than 8 letters',
      input: str
    })
  }
  return errs
}

// secondary validations
v.option = obj_typevalid('option', {
  user_id: v.user_id,
  creation_date: v.creation_date,
  option: v.option_str
})
v.options = arr_typevalid('options', {
  '{}': v.option
})
v.poll = obj_typevalid('poll', {
  user_id: v.user_id,
  creation_date: v.creation_date,
  options: v.options
})

module.exports = v

},{}],3:[function(require,module,exports){
// tools loading
require('./lib/jonoShortcuts.js')
w.wait = require('./lib/wait.js')
w.postJSON = require('./lib/postJSON.js')

// module loading
w.modules = {
  poll_create: require('./modules/poll_create.js'),
  poll_view: require('./modules/poll_view.js'),
  header_message: require('./modules/header_message.js'),
  ws: require('./modules/ws.js'),
  datas: require('./modules/$data.js')
}

vueobj = {
  el: '#app',
  data: {},
  computed: {},
  watch: {},

  methods: {},

  // https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram
  beforeCreate: function(){},
  created: function(){},
  beforeMount: function(){},
  mounted: function(){},
  beforeUpdate: function(){},
  updated: function(){},
  beforeDestroy: function(){},
  destroyed: function(){}
}

Object.keys(modules).forEach(function(name){
  modules[name](vueobj)
})

w.vm = new Vue(vueobj)

},{"./lib/jonoShortcuts.js":4,"./lib/postJSON.js":5,"./lib/wait.js":6,"./modules/$data.js":7,"./modules/header_message.js":8,"./modules/poll_create.js":9,"./modules/poll_view.js":10,"./modules/ws.js":11}],4:[function(require,module,exports){
// Base Browser stuff
window.w = window
w.D = Document
w.d = document

Element.prototype.qs = Element.prototype.querySelector
Element.prototype.qsa = Element.prototype.querySelectorAll
D.prototype.qs = Document.prototype.querySelector
D.prototype.qsa = Document.prototype.querySelectorAll

EventTarget.prototype.on = EventTarget.prototype.addEventListener
EventTarget.prototype.off = EventTarget.prototype.removeEventListener
EventTarget.prototype.emit = EventTarget.prototype.dispatchEvent

// http://stackoverflow.com/questions/11761881/javascript-dom-find-element-index-in-container
Element.prototype.getNodeIndex = function() {
  var node = this
  var index = 0;
  while ( (node = node.previousSibling) ) {
    if (node.nodeType != 3 || !/^\s*$/.test(node.data)) {
        index++;
    }
  }
  return index;
}

NodeList.prototype.toArray = function() {
  return Array.prototype.map.call(this, function(item){
    return item
  })
}

HTMLCollection.prototype.toArray = function() {
  return NodeList.prototype.toArray.call(this)
}

Node.prototype.prependChild = function(el) {
  var parentNode = this
  parentNode.insertBefore(el, parentNode.firstChild)
}

},{}],5:[function(require,module,exports){
module.exports = function postJSON({url, data, progresscb, cb, cookies}) {
  var req = new XMLHttpRequest()
  req.onreadystatechange = function(e) {
    if (req.readyState === 4) {
      if (typeof cb === 'function')
        cb(req.response)
    }
  }
  if (typeof progresscb === 'function')
    req.upload.addEventListener('progress', progresscb)
  // function(e){
  //   $progress.style.width = Math.ceil(e.loaded/e.total) * 100 + '%';
  // }, false);
  req.withCredentials = Boolean(cookies)
  req.open('POST', url, true)
  req.setRequestHeader('Content-Type', 'application/json')
  if (typeof data !== 'string') {
    data = JSON.stringify(data)
  }
  req.responseType = 'json'
  req.send(data)
}

},{}],6:[function(require,module,exports){
module.exports = function(ms){
  return new Promise(function(resolve){
    setTimeout(resolve, ms)
  })
}

},{}],7:[function(require,module,exports){
module.exports = function({methods, data}) {
  var versions = []
  methods.data_lines = function(o){
    let vm = this
    let l = JSON.parse(JSON.stringify(o))
    delete l.dataline
    let txt = JSON.stringify(l, null, 2)
    versions.push( txt.split('\n') )
    return txt
  }
}

},{}],8:[function(require,module,exports){
module.exports = function({data, methods}) {
  data.header_messages = []
  data.header_message_text = null

  methods.header_message_add = function({msg, action_fn}){
    // data.header_messages.push({msg, action_fn})
    data.header_message_text = '4 new polls made. click to show.'
  }

  methods.header_message_onclick = function(e) {
    data.header_message_text = null
  }

  methods.header_message_beforeEnter = function(el, done){
    // Velocity(el, 'transition.bounceRightIn', { duration: 1000 }).then(done)
  }
  methods.header_message_enter = function(el, done){
    Velocity(el, 'transition.slideDownBigIn', {duration: 1000}).then(
    function(el){
      return Velocity(el, 'callout.flash', {duration: 500})
    }).then(done)
  }
  methods.header_message_leave = function(el, done){
    // see Velocity.Redirects
    Velocity(el, 'transition.slideUpBigOut', { duration: 1000 }).then(done)
  }


  wait(1000).then(function(){
    vm.header_message_add({})
  })
}

},{}],9:[function(require,module,exports){
var poll_map = require('../../server/dao/poll_map.js')
var type_validation = require('../browser+node/type_validation.js')

module.exports = function({data, methods}){

  methods.poll_create__reset = function() {
    data.poll_create = {
      user_id: 'davee',
      question: '',
      options: ['', ''],
      status: ''
    }
  }

  methods.poll_create__add_option = function(){
    this.poll_create.options.push('')
  }
  methods.poll_create__remove_option = function(i){
    this.poll_create.options.splice(i, 1)
  }

  methods.poll_create__post = function(){
    let vm = this
    var poll = poll_map(vm.poll_create)
    var validness = poll_type_validation.poll(poll)

    debugger
    // TODO validate poll_create fields
    // TODO if any field invalid underline red
    // icon explanaition mark,
    // err message underneith
  }

  methods.poll_create__reset()
  data.poll_create.question = 'Should the United Kingdom Leave the European Union?',
  data.poll_create.options[0] = 'no the UK should Bremain in the EU',
  data.poll_create.options[1] = 'yes the UK should Brexit the EU'
}

/*
{
  cmd: 'poll_create',
  data: {
    poll: {
      question: vm.poll_create.question,
      user_id: vm.poll_create.user_id,
      options: vm.poll_create.options.reduce(function(arr, option){
        if (option.value.length > 0) {
          arr.push(option.value)
        }
        return arr
      }, [])
    }
  }
*/

},{"../../server/dao/poll_map.js":13,"../browser+node/type_validation.js":2}],10:[function(require,module,exports){
module.exports = function({data, methods}) {
  data.polls = []
  methods.poll1reset = function() {
    data.polls = []
  }
  methods.vote_tick = function(poll, option) {
    // check if option in array
    var option_exists = poll.options.find(function(item){
      return item.option === option
    })
    if (option_exists === undefined) {return}

    if (poll.user_view.vote_tick === option) {
      // untick a vote
      poll.user_view.vote_tick = null
    } else {
      // tick a vote box
      poll.user_view.vote_tick = option
    }
  }

  methods.vote_cast = function(poll) {
    if (poll.user_view.vote_tick === null) {return}
    // send the vote
    console.log('vote_cast TODO')
  }

  methods.poll1reset()

}

},{}],11:[function(require,module,exports){
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

},{"../browser+node/isJSON.js":1}],12:[function(require,module,exports){
module.exports = function(a,b){
  return (new Date(a.creation_date)).getTime() < (new Date(b.creation_date)).getTime()
}

},{}],13:[function(require,module,exports){
var poll_option_map = require('./poll_map__option.js')
var poll_map__option_GC = require('./poll_map__option_GC.js')

module.exports = function(o, bool) {
  o = JSON.parse(JSON.stringify(o))
  if (o.creation_date === undefined) {
    o.creation_date = new Date()
  }
  if (Array.isArray(o.options) === false) { o.options = [] }
  o.options = o.options.map(poll_option_map(o))
  if (bool === true) {
    o.options = poll_map__option_GC(o.options)
  }

  return {
    question: o.question,
    user_id: o.user_id,
    creation_date: o.creation_date,
    options: o.options,
    votes: [],
  }
}

},{"./poll_map__option.js":14,"./poll_map__option_GC.js":15}],14:[function(require,module,exports){
module.exports = function(o) {
  return function(option){
    if (typeof option === 'string') {
      return {
        option: option,
        user_id: o.user_id,
        creation_date: o.creation_date
      }
    }
    return option
  }
}

},{}],15:[function(require,module,exports){
var type_validate = require('../../app/browser+node/type_validation.js')
var sort_creation_date = require('./fn_sort_creation_date.js')

// remove invalid options from the options array
module.exports = function(options) {
  return options
  .sort(sort_creation_date)
  .reduce(function(arr,option){
    const option_validness = type_validate.option(option)
    const i = arr.findIndex(function(o2){
      return o2.option === option.option
    })
    if (option_validness.valid === true && i === -1) {
      arr.push(option)
    }
    return arr
  },[])
}

},{"../../app/browser+node/type_validation.js":2,"./fn_sort_creation_date.js":12}]},{},[3]);
