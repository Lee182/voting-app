// lib loading
require('./lib/jonoShortcuts.js')
w.postJSON = require('./lib/postJSON.js')

// module loading
w.poll_create = require('./modules/poll_create.js')
w.poll1 = require('./modules/poll.js')

w.data = {
  polls: []
}
w.methods = {}
poll_create({data, methods})
poll1({data, methods})


w.vm = new Vue({
  el: '#app',
  data,
  computed: {},
  watch: {
    polls: function(e){
      console.log('polls change')
    }
  },
  methods,
  beforeCreate: function(){
    require('./modules/ws.js')(this)
  }
})
