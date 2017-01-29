var type_validate = require('../../app/browser+node/type_validation.js')
var vote_tools = require('./vote_tools')
var poll_map = require('./poll_map.js')
var poll_map__option_GC = require('./poll_map__option_GC.js')

// data acess object
const Mongo = require('mongodb')
let MongoClient = Mongo.MongoClient
let mongourl = process.env.MONGOURL || require('../keys.js').mongourl
let o = {
  db: null,
  ObjectId: Mongo.ObjectId
  // cb function called when change happens
}

function call_cb(obj) {
  if (typeof o.cb === 'function') {
    o.cb(obj) // obj {cmd, poll, vote, option}
  }
}

function ensureConnected(fn) {return function() {
  if (o.db === null) {return Promise.resolve({err: 'db disconnected'})}
  return fn.apply(o, arguments)
}}

o.connect = function() {
  console.log('mongo connnecting...')
  return MongoClient.connect(mongourl).then(function(db){
    console.log('mongo connected') // setup db
    o.db = db
  }).catch(function(err){
    console.log('mongo connection error:', err)
    o.db = null
  })
}

o.poll_create = ensureConnected(function({poll}){
  poll = poll_map(poll)
  var errs = type_validate.poll(poll)
  if (errs.length !== 0) {
    return Promise.resolve({err: errs})
  }
  return o.db.collection('polls')
    .insert(poll)
    .then(function(result){
      call_cb({cmd: 'poll_create', poll: result.ops[0]})
      return Promise.resolve({poll: result.ops[0]})
    })
    .catch(function(err){
      return Promise.resolve({err})
    })
})

o.poll_remove_all = ensureConnected(function(){
  call_cb({cmd: 'poll_remove_all'})
  return o.db.collection('polls').remove({})
})

o.poll_remove = ensureConnected(function({poll_id}){
  return o.db.collection('polls')
    .remove({_id: poll_id}).then(function(res){
      if (res.result.n === 0) {
        return Promise.resolve({err: 'none removed'})
      }
      call_cb({cmd: 'poll_remove', poll_id})
      return {result: res.result, poll_id}
    })
})

o.poll_vote = ensureConnected(function({vote, poll_id, ip}){
  var vote_errs = type_validate.vote(vote)
  if (vote_errs.length !== 0) {
    return Promise.resolve({err: vote_errs})
  }
  if (typeof ip === 'string') {
    vote.ip = ip
  }
  return o.poll_read_byid({poll_id}).then(function(poll){
    var query = {_id: poll_id}
    var set = {}
    var options = {returnOriginal: false}
    if (vote.user_id !== undefined && vote_tools.has_ip(poll.votes, ip) !== undefined) {
      query.votes = {$elemMatch: {ip: ip,  user_id: {$exists: false}}}
      set = {$set: {'votes.$': vote} }
    }
    else if (vote_tools.has_user_id(poll.votes, vote.user_id) !== undefined) {
      query.votes = {$elemMatch: {user_id: vote.user_id} }
      set = {$set: {'votes.$': vote} }
    }
    else {
      set = {$push: {votes: vote }}
    }
    return o.db.collection('polls')
      .findOneAndUpdate(query, set, options)
      .then(function(res){
        poll = res.value
        call_cb({cmd: 'poll_vote', poll})
        return Promise.resolve({poll})
      })
      .catch(function(err){
        return Promise.resolve({err})
      })
  })
})

o.poll_option_add = ensureConnected(function({option, poll_id}) {
  var errs = type_validate.option(option)
  if (errs.length !== 0) {
    return Promise.resolve({err: errs})
  }
  function will_adding_option_change_record({poll, option}){
    let unique_options = poll.options.map(function(a){return a})
    unique_options.push(option)
    unique_options = poll_map__option_GC(unique_options)

    const changes = JSON.stringify(poll.options) !== JSON.stringify(unique_options)

    return {changes, unique_options}
  }

  return o.poll_read_byid({poll_id}).then(function(poll){
    if (poll === null) {
      return Promise.resolve({err: 'poll_id not found'})
    }
    let a = will_adding_option_change_record({poll, option})
    if (a.changes === true) {
      poll.options = a.unique_options
    }
    return o.db
      .collection('polls')
      .findOneAndReplace(
        {_id: poll._id},
        poll,
        {returnNewDocument: true}
      )
      .then(function(result){
        call_cb({cmd: 'poll_option_add', poll:result.value, option})
        return Promise.resolve({poll, option})
      })
  })
})

o.poll_option_remove = ensureConnected(function({option, poll_id}){
  return o.db.collection('polls')
    .findOneAndUpdate(
      {_id: poll_id},
      {$pull: {options: {option: option} } }
    )
    .then(function(result){
      call_cb({cmd: 'poll_option_remove', poll:result.value, option})
      return Promise.resolve({option, poll: result.value})
    })
    .catch(function(err){
      return Promise.resolve({err})
    })
})



o.poll_read_byid = ensureConnected(function({poll_id}){
  return o.db.collection('polls').findOne({_id: poll_id})
})

o.poll_read = ensureConnected(function({find, project, user_id, findOne}) {
  var f = 'find'
  if (findOne) {f = 'findOne'}
  return o.db
    .collection('polls')
    [f](find, project)
})

o.poll_reads = ensureConnected(function({find_options}) {
  if (find_options === undefined) {find_options = {}}
  // find_options {findOne, limit, pagenum}
  var f = find_options.findOne === true ? 'findOne' : 'find'
  var limit = (Number(find_options.limit) <= 10) ?
     Number(find_options.limit): 10
  var skip = limit * (find_options.pagenum || 0)
  return o.db
    .collection('polls')
    [f]({}, {})
    .skip(skip)
    .limit(limit)
    .toArray()
    .then(function(polls){
      return Promise.resolve({polls, find_options})
    })
})


module.exports = o
