(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var build = require('../dao/poll_build.js')
poll = build({
  question: 'Whats your favourite color',
  user_id: 'dave',
  creation_date: new Date()
})

var validation = require('../dao/validate')
var val = validation.poll(poll)
if (val.valid === true) {
  db.collection('polls')
    .insert(poll)
    .catch(function(err){
      console.log(err)
    })
    then(function(result){
      console.log(result)
    })
}

},{"../dao/poll_build.js":2,"../dao/validate":3}],2:[function(require,module,exports){
module.exports = function({
  question,
  user_id,
  creation_date,
  options,
  anomynous_can_add_option,
  anomynous_can_vote,
  visibility,
  takein_new_votes
}) {
  if (Array.isArray(options) === false) {
    options = []
  }
  options = options.map(function(option){
    if (typeof option === 'string') {
      return {option, user_id, creation_date}
    }
    return option
  })
  if (anomynous_can_add_option === undefined) {
    anomynous_can_add_option = false
  }
  if (anomynous_can_vote === undefined) {
    anomynous_can_vote = true
  }
  if (takein_new_votes === undefined) {
    takein_new_votes = true
  }
  return {
    question,
    user_id,
    creation_date,
    options: options,
    votes: [],
    anomynous_can_add_option: Boolean(anomynous_can_add_option),
    anomynous_can_vote: Boolean(anomynous_can_vote),
    visibility: visibility || 'public',
    takein_new_votes: Boolean(takein_new_votes)
  }
}
// purpose to fill in the gaps

},{}],3:[function(require,module,exports){
function validate_poll(o) {
  let errs = []
  if (typeof o.question !== 'string') {
    errs.push('question type must be a string')
  }
  else if (o.question < 8) {
    errs.push('question must be longer than 8 chars')
  }
  if (typeof o.user_id !== 'string'){
    err.push('user_id isnt a string')
  }
  if (Array.isArray(o.options) !== true) {
    errs.push('options isnt an array')
  } else {
    // filter out options so only unique choices
    o.options = o.options.reduce(function(arr, cur){
      var option_validness = validate_option(cur.option).valid
      if (arr.findIndex(function(b){
        b.option === cur.option
      }) === -1) {
        option_validness = false
      }
      if (option_validness === true) {
        arr.push(cur)
      }
      return arr
    }, [])
  }
  if ( notBoolean(anomynous_can_add_option) ){
    errs.push('anomynous_can_add_option not Boolean')
  }
  if ( notBoolean(anomynous_can_vote) ){
    errs.push('anomynous_can_vote not Boolean')
  }
  if ( notBoolean(takein_new_votes) ){
    errs.push('takein_new_votes not Boolean')
  }
  if (Array.isArray(visibility)){
    var eachisStr = visibility.reduce(function(bool, cur){
      if (typeof cur !== 'string') {
        bool = false
      }
      return bool
    }, true)
    if (eachisStr === false) {
      errs.push('user_ids in visibility array are not a strings')
    }
  }
  return {field: 'poll', errs, valid: errs.length === 0}
}

function notBoolean(bool) {
  return bool === true || bool === false
}

function validate_option(o) {
  let errs = []
  if (typeof o.option !== 'string' ||
      o.option === ''
  ) {
    errs.push('option not a string')
  }
  if ((new Date(o.creation_date)).toString() === 'Invalid Date') {
    errs.push('creation_date invalid')
  }
  return {field: 'option', errs, valid: errs.length === 0}
}

module.exports = {
  poll: validate_poll,
  option: validate_option,
  vote: validate_option
}

},{}]},{},[1]);
