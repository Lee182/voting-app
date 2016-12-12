w = window
io = require('socket.io-client')
w.postJSON = require('./lib/postJSON.js')

w.ws = io('http://localhost:3000')
ws.on('connect', function(e){
  console.log('connect', 1, e)
})
ws.on('event', function(data){
  console.log('event', 2, data)
})
ws.on('disconnect', function(e){
  console.log('disconnect', 3, e)
})

w.app = new Vue({
  el: '#app',
  data: {},
  computed: {},
  watch: {},
  methods: {},
  beforeCreate: function(){
    console.log('before create')
  }
})
