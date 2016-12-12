w = window
io = require('socket.io-client')
w.postJSON = require('./lib/postJSON.js')


w.app = new Vue({
  el: '#app',
  data: {
    votes: []
  },
  computed: {},
  watch: {},
  methods: {},
  beforeCreate: function(){
    console.log('before create')
  }
})



w.ws = io('http://localhost:3000')
ws.on('connect', function(e){
  console.log('connect', 1, e)
})
ws.on('event', function(data){
  console.log('event', 2, data)
})

ws.on('poll', function(data){
  let poll_index = app.votes.findIndex(function(poll){
    return poll._id === data._id
  })
  console.log(poll_index)
  if (poll_index === -1) {
    return app.votes.push(data)
  }
  if (app.votes[poll_index].date < data.date) {
    app.votes[poll_index] = data
  }
})

ws.on('disconnect', function(e){
  console.log('disconnect', 3, e)
})

/*

// create poll
ws.emit('run', {
  cmd: 'poll_create',
  data: {
    poll: {
      question: 'Whats your favourite color',
      user_id: 'dave',
      options: ['red', 'yellow', 'green'],
      creation_date: new Date()
    }
  }
})


// add option
ws.emit('run',{
  cmd: 'poll_option_add',
  data: {
    option: {
      option: 'blue',
      user_id: 'dave',
      creation_date: new Date()
    },
    poll_id: '584ebef22b51604ce42a9f86'
  }
})

*/
