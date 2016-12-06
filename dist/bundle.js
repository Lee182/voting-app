(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// voting app in pure javascript before server implementation

poll_build = require('../dao/poll_build.js')
type_validate = require('../dao/type_validate')

polls_db = []
// lego
window.determin_owner = function({poll_user_id, user_id}) {
  // c = user_exits('dave')// user_exits(a.user_id)
  c = Promise.resolve().then(function(user){
    if (user_id === null) {
      return Promise.resolve({err: 'user not found'})
      // responds err: user not found
    }
    if (user_id !== poll_user_id) {
      return Promise.resolve({err: 'user is faking id'})
    }
    if (poll_user_id === user_id) {
      return Promise.resolve({ok: true})
    }
    return Promise.resolve({ok: true})
  })
  return c
}

window.create_poll = function({poll, user}) {
  let a = poll_build(poll)
  let b = type_validate.poll(a)
  if (b.valid === false) {
    return Promise.resolve({err: 'invalid type', type_validation: b})
  }
  return determin_owner({
    poll_user_id: a.user_id,
    user_id: 'dave'
  }).then(function(){
    a._id = Date.now()+'-'+(Math.floor(Math.random()*1000)).toString()
    polls_db.push(a)

    return Promise.resolve({result: a})
  })
}

window.hard_delete_poll = function({poll_id, user_id}){
  const poll = polls_db.findIndex(function(poll){
    return poll._id === poll_id && user_id === poll.user_id
  })
  if (poll === -1) {return Promise.resolve({err: 'poll not found, or not owner'})}
  return polls_db.splice(poll, 1)
}

window.voteon_poll = function({poll_id, vote}) {
  const val = type_validate.vote(vote)
  if (val.valid === false) {
    return Promise.resolve({err: 'invalid vote type'})
  }
  var poll = polls_db.find(function(poll){
    return poll._id === poll_id
  })
  if (poll === null) {
    return Promise.resolve({err: 'poll not found'})
  }
  var options = poll.options.map(function(op){
    return op.option
  })
  if (poll.options.findIndex(function(op){
    return op.option === vote.option
  }) === -1) {
    return Promise.resolve({err: 'vote option not in register'})
  } else {
    if (vote.user_id) {
      poll.votes = poll.votes.filter(function(v){
        return v.user_id !== vote.user_id
      })
    }
    poll.votes.push(vote)
    return Promise.resolve({ok: true, vote, poll_id, poll})
  }
}

window.add_option_poll = function({poll_id, option}){
  var val = type_validate.option(option)
  if (val.valid === false) {
    return Promise.resolve({err: 'invalid option type'})
  }
}
// 1. only a user can create a new poll
//   a. a user owner can create a poll with many different options [x]
create_poll({
  poll:{
    question: 'Whats your favourite color',
    user_id: 'dave',
    creation_date: new Date(),
    options: ['red', 'blue', 'green']
  },
}).then(function(o){
  console.log(o.result)

// 2. only a owner can delete a poll [x]
// return hard_delete_poll({
//   poll_id: o.result._id,
//   user_id: 'dave'
// })
voteon_poll({
  poll_id: o.result._id,
  vote: {
    user_id: 'barry',
    option: 'red',
    creation_date: new Date()
  }
}).then(function(a){
  console.log(a)
})

voteon_poll({
  poll_id: o.result._id,
  vote: {
    option: 'green',
    creation_date: new Date()
  }
}).then(function(a){
  console.log(a)
})

voteon_poll({
  poll_id: o.result._id,
  vote: {
    option: 'yellow',
    creation_date: new Date()
  }
}).then(function(a){
  console.log(a)
})

voteon_poll({
  poll_id: o.result._id,
  vote: {
    user_id: 'barry',
    option: 'blue',
    creation_date: new Date()
  }
}).then(function(a){
  console.log(a)
})

}).catch(function(err){
  return Promise.resolve({err: 'network err', neterr: err})
})


// o.anomynous_can_add_option,
// o.anomynous_can_vote,
// o.visibility,
// o.takein_new_votes

// RULES
// 1. only a user can create a new poll [x]
//   a. a user owner can create a poll with many different options [x]
// 2. only a owner can delete a poll [x]
// 3. a user or non-user can vote on a poll [x]
//   a. a user only gets 1 vote
// 4. another user can add options to a poll []


// FRONT END
// 1. a user can share a poll with my friends
// 2. a user or non-user can see results aggregated
// 3. a user or non-user can see a Chart.js

},{"../dao/poll_build.js":3,"../dao/type_validate":6}],2:[function(require,module,exports){
module.exports = function(a,b){
  return (new Date(a.creation_date)).getTime() < (new Date(b.creation_date)).getTime()
}

},{}],3:[function(require,module,exports){
var poll_option_map = require('./poll_option_map.js')
var poll_option_GC = require('./poll_option_GC.js')

function poll_build(o) {
  // o.question,
  // o.user_id,
  // o.creation_date,
  // o.options,
  // o.anomynous_can_add_option,
  // o.anomynous_can_vote,
  // o.visibility,
  // o.takein_new_votes
  if (o.creation_date === undefined) {
    o.creation_date = new Date()
  }
  if (Array.isArray(o.options) === false) { o.options = [] }
  o.options = o.options.map(poll_option_map(o))
  o.options = poll_option_GC(o.options)

  if (o.anomynous_can_add_option === undefined) {
    o.anomynous_can_add_option = false
  }
  if (o.anomynous_can_vote === undefined) {
    o.anomynous_can_vote = true
  }
  if (o.takein_new_votes === undefined) {
    o.takein_new_votes = true
  }
  return {
    question: o.question,
    user_id: o.user_id,
    creation_date: o.creation_date,
    options: o.options,
    votes: [],
    anomynous_can_add_option: Boolean(o.anomynous_can_add_option),
    anomynous_can_vote: Boolean(o.anomynous_can_vote),
    visibility: o.visibility || 'public',
    takein_new_votes: Boolean(o.takein_new_votes)
  }
}

module.exports = poll_build

},{"./poll_option_GC.js":4,"./poll_option_map.js":5}],4:[function(require,module,exports){
var type_validate = require('./type_validate')
var sort_creation_date = require('./fn_sort_creation_date.js')

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

},{"./fn_sort_creation_date.js":2,"./type_validate":6}],5:[function(require,module,exports){
module.exports = function(o) {
  return function(option){
    if (typeof option === 'string') {
      return {option: option, user_id: o.user_id, creation_date: o.creation_date}
    }
    return option
  }
}

},{}],6:[function(require,module,exports){
function validate_poll(o) {
  let errs = []
  if (typeof o.question !== 'string') {
    errs.push('question type must be a string')
  }
  else if (o.question.length < 8) {
    errs.push('question must be longer than 8 chars')
  }
  if (typeof o.user_id !== 'string'){
    errs.push('user_id isnt a string')
  }
  if (o.user_id.length <= 0) {
    errs.push('user_id is small')
  }
  if (Array.isArray(o.options) !== true) {
    errs.push('options isnt an array')
  }
  if ( notBoolean(o.anomynous_can_add_option) ){
    errs.push('anomynous_can_add_option not Boolean')
  }
  if ( notBoolean(o.anomynous_can_vote) ){
    errs.push('anomynous_can_vote not Boolean')
  }
  if ( notBoolean(o.takein_new_votes) ){
    errs.push('takein_new_votes not Boolean')
  }
  if (Array.isArray(o.visibility)){
    var eachisStr = o.visibility.reduce(function(bool, cur){
      if (typeof cur !== 'string') {
        bool = false
      }
      return bool
    }, true)
    if (eachisStr === false) {
      errs.push('user_ids in visibility array are not a strings')
    }
  }
  return {field: 'poll', errs, valid: errs.length === 0, o: o}
}

function notBoolean(bool) {
  return !(bool === true || bool === false)
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
  return {field: 'option', errs, valid: errs.length === 0, o: o}
}

module.exports = {
  poll: validate_poll,
  option: validate_option,
  vote: validate_option
}

},{}]},{},[1]);
