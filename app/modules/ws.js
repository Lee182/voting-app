io = require('socket.io-client')

module.exports = function(){
  // window
  var ws = io('http://localhost:3000')
  ws.on('connect', function(e){
    console.log('connect', 1, e)
  })
  ws.on('event', function(data){
    console.log('event', 2, data)
  })

  ws.on('poll', function(new_poll){
    console.log('new_poll', new_poll)

    let poll_index = app.polls.findIndex(function(poll){
      return poll._id === new_poll._id
    })
    if (poll_index === -1) {
      return app.polls.push(new_poll)
    }
    if (new_poll.date > app.polls[poll_index].date) {
      console.log('herorro')
      app.$set(app.polls, poll_index, new_poll)
    }
  })

  ws.on('disconnect', function(e){
    console.log('disconnect', 3, e)
  })

  return ws
}






/*

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
