// voting app in pure javascript before server implementation
poll_build = require('../dao/poll_build.js')
poll_option_GC = require('../dao/poll_option_GC.js')
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

  var poll = polls_db.find(function(poll){
    return poll._id === poll_id
  })

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
