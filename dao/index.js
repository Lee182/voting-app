var type_validate = require('./type_validate')
var poll_build = require('./poll_build.js')

// data acess object
const Mongo = require('mongodb')
let MongoClient = Mongo.MongoClient
let mongourl = process.env.MONGOURL || require('../keys.js').mongourl
let o = {
  db: null,
  ObjectId: Mongo.ObjectId
}

function ensureConnected(fn) {return function() {
  if (o.db === null) {return Promise.reject('db disconnected')}
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

o.user_exists = ensureConnected(function(_id){
  return o.db.collection('poll_users')
    .findOne({_id})
    .then(function(result){
      if (result === null) {
        return Promise.reject(null)}
      return Promise.resolve(result)
    })
})

o.poll_create = ensureConnected(function({poll}){
  poll = poll_build(poll)

  var val = type_validate.poll(poll)
  if (val.valid === false) {
    return Promise.reject({err: val})
  }
  return o.db.collection('polls')
    .insert(poll)
    .then(function(result){
      return Promise.resolve({result: result.ops[0]})
    })
    .catch(function(err){
      return Promise.reject({err})
    })
})

o.poll_option_add = ensureConnected(function({option, poll_id}){
  var val = type_validate.option(option)
  if (val.valid === false) {
    return Promise.reject({err: val})
  }
  return o.db.collection('polls')
    .update(
      {_id: poll_id},
      {$push: {options: option} }
    )
    .then(function(result){
      return Promise.resolve({result: result.result})
    })
    .catch(function(err){
      return Promise.reject(err)
    })
})

o.poll_option_remove = ensureConnected(function({option, poll_id}){
  return o.db.collection('polls')
    .update(
      {_id: poll_id},
      {$pull: {options: option} }
    )
    .then(function(result){
      return Promise.resolve(result)
    })
    .catch(function(err){
      return Promise.reject(err)
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
    return Promise.reject({err: val})
  }
  return o.db.collection('polls')
    .update(
      {_id: poll_id},
      {$push: {vote: vote} }
    )
    .then(function(result){
      return Promise.resolve(result)
    })
    .catch(function(err){
      return Promise.reject(err)
    })
})


module.exports = o
