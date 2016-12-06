var type_validate = require('./type_validate')
var poll_build = require('./poll_build.js')
var poll_option_GC = require('./poll_option_GC.js')

// data acess object
const Mongo = require('mongodb')
let MongoClient = Mongo.MongoClient
let mongourl = process.env.MONGOURL || require('../keys.js').mongourl
let o = {
  db: null,
  ObjectId: Mongo.ObjectId
}

function ensureConnected(fn) {return function() {
  if (o.db === null) {return Promise.resolve({err: 'db disconnected'})}
  return fn.apply(o, arguments)
}}

o.connect = function() {
  return MongoClient.connect(mongourl).then(function(db){
    console.log('mongo connected') // setup db
    o.db = db
  }).catch(function(err){
    console.log('mongo connection error:', err)
    o.db = null
  })
}

o.poll_create = ensureConnected(function({poll}){
  poll = poll_build(poll)

  var val = type_validate.poll(poll)
  if (val.valid === false) {
    return Promise.resolve({err: val})
  }
  return o.db.collection('polls')
    .insert(poll)
    .then(function(result){
      return Promise.resolve({result: result.ops[0]})
    })
    .catch(function(err){
      return Promise.resolve({err})
    })
})

o.poll_remove = ensureConnected(function({_id}){
  return o.db.collection('polls')
    .remove({_id})
})

o.poll_read = ensureConnected(function({find, project, user_id, findOne}) {
  find.$or = [
    { visibility: 'public' },
    { visibility: user_id },
  ]
  var f = 'find'
  if (findOne) {f = 'findOne'}
  return o.db
    .collection('polls')
    [f](find, project)
})

o.poll_vote = ensureConnected(function({vote, poll_id}){
  var val = type_validate.vote(vote)
  if (val.valid === false) {
    return Promise.resolve({err: val})
  }
  return o.db.collection('polls')
    .update(
      {_id: poll_id},
      {$push: {vote: vote} }
    )
    .then(function(result){
      return Promise.resolve({result})
    })
    .catch(function(err){
      return Promise.resolve({err})
    })
})

o.poll_read_byid = ensureConnected(function({poll_id}){
  return o.db.findOne({_id: poll_id})
})

o.poll_option_add = ensureConnected(function({option, poll_id}) {
  // verify option {option: 'string', creation_date: Date}
  var val = type_validate.option(option)
  if (val.valid === false) {
    return Promise.resolve({err: val})
  }
  function will_adding_option_change_record({poll, option}){
    let unique_options = poll.options.map(function(a){return a})
    unique_options.push(option)
    unique_options = poll_option_GC(unique_options)

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
      .findOneAndReplace({_id: poll._id}, poll)
      .then(function(result){
        return Promise.resolve({poll, option, result})
      })
  })
})

o.poll_option_remove = ensureConnected(function({option, poll_id}){
  return o.db.collection('polls')
    .update(
      {_id: poll_id},
      {$pullAll: {options: {$elemMatch: {option}} } }
    )
    .then(function(result){
      return Promise.resolve({result})
    })
    .catch(function(err){
      return Promise.resolve({err})
    })
})


module.exports = o
