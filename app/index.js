// tools loading
require('./lib/jonoShortcuts.js')
w.wait = require('./lib/wait.js')
w.postJSON = require('./lib/postJSON.js')

var poll_example = require('../example_json/poll_many-votes.js')
var vue_charts = require('vue-charts')

Vue.use(vue_charts)
// module loading
w.modules = {
  poll_create: require('./modules/poll_create.js'),
  poll_view: require('./modules/poll_view.js'),
  header_message: require('./modules/header_message.js'),
  ws: require('./modules/ws.js'),
  datas: require('./modules/$data.js'),
  chart: require('./modules/example_chart.js')
}

vueobj = {
  el: '#app',
  data: {
    user_id: 'davee'
  },
  computed: {},
  watch: {},

  methods: {},

  // https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram
  beforeCreate: function(){},
  created: function(){
    let vm = this
    vm.poll_view__addpoll(poll_example)
  },
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
