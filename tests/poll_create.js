dao = require('../dao/index.js')
function log(str) {
  return function(a){
    console.log(str, a)
    return Promise.resolve(a)
  }
}

Promise.resolve().then(function(){

  return dao.connect()

}).then(function(){

  return dao.db.collection('polls').remove({})

}).then(function(){

  return dao.poll_create({
    poll: {
      question: 'Whats your favourite color',
      user_id: 'dave',
      creation_date: new Date()
    }
  }).then(log('pol_create: res:'))


}).then(function(res){

  // return dao.poll_option_add({
  //   option: {
  //     option: 'blue',
  //     user_id: 'dave',
  //     creation_date: new Date()
  //   },
  //   poll_id: res.result._id
  // })
  // .then(log('poll_option_add: res:'))
  // .catch(log('poll_option_add: err:'))

})
