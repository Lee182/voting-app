var poll_map = require('../../server/dao/poll_map.js')
w.type_validation = require('../browser+node/type_validation.js')

module.exports = function({data, methods}){

  methods.poll_create__reset = function() {
    data.poll_create = {
      question: '',
      options: ['', ''],
    }
    data.poll_create__status = ''
    data.poll_create__errs = []
    data.poll_create__option_blank = false
  }

  methods.poll_create__add_option = function(){
    this.poll_create.options.push('')
  }
  methods.poll_create__remove_option = function(i){
    this.poll_create.options.splice(i, 1)
    this.poll_create__validate()
  }

  function _check_for_blank(errs) {
    var bool = false
    errs.forEach(function(err){
      if (err.msg === 'option is blank') {bool = true}
    })
    data.poll_create__option_blank = bool
  }

  methods.poll_create__validate = function(e) {
    let vm = this
    data.poll_create.user_id = vm.user_id
    var poll = poll_map(vm.poll_create)
    vm.poll_create__errs = type_validation.poll(poll)
    _check_for_blank(vm.poll_create__errs)
    vm.$forceUpdate()
    return poll
  }

  methods.poll_create__post = function(){
    let vm = this
    var poll = vm.poll_create__validate()
    if (vm.poll_create__errs.length !== 0) {
      return
    }
    vm.poll_create__status = 'sending...'
    vm.ws_run({
      cmd: 'poll_create',
      data: {poll}
    }).then(function(o){
      console.log(o)
      if (o.res.err === undefined) {
        vm.poll_create__reset()
        vm.poll_view__addpoll(o.res.poll)
      }
    })
  }

  methods.poll_create__reset()
  data.poll_create.question = 'Should the United Kingdom Leave the European Union?',
  data.poll_create.options[0] = 'no the UK should Bremain in the EU',
  data.poll_create.options[1] = 'yes the UK should Brexit the EU'
}
