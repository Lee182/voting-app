// lib loading
require('./lib/jonoShortcuts.js')
w.wait = require('./lib/wait.js')
w.postJSON = require('./lib/postJSON.js')
// module loading
poll_create = require('./modules/poll_create.js')
poll_view = require('./modules/poll.js')


w.data = {
  polls: []
}
w.methods = {}
w.ws = require('./modules/ws.js')({data})
poll_create({data, methods})
poll_view({data, methods})

w.vm = new Vue({
  el: '#app',
  data,
  computed: {},
  watch: {},
  methods,
  beforeCreate: function(){},
  mounted: function(){
    this.toast_count(1)
  }
})
