// tools loading
require('./lib/jonoShortcuts.js')
w.wait = require('./lib/wait.js')
w.postJSON = require('./lib/postJSON.js')

// module loading
w.modules = {
  poll_create: require('./modules/poll_create.js'),
  poll_view: require('./modules/poll_view.js'),
  header_message: require('./modules/header_message.js'),
  ws: require('./modules/ws.js')
}

vueobj = {
  el: '#app',
  data: {},
  computed: {},
  watch: {},

  methods: {},

  // https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram
  beforeCreate: function(){},
  created: function(){},
  beforeMount: function(){},
  mounted: function(){},
  beforeUpdate: function(){},
  updated: function(){},
  beforeDestroy: function(){},
  destroyed: function(){}
}

Object.keys(modules).forEach(function(name){
  modules[name](vueobj)
})

w.vm = new Vue(vueobj)
