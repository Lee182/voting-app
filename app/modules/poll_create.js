var poll_map = require('../../server/dao/poll_map.js')
var type_validation = require('../browser+node/type_validation.js')

module.exports = function({data, methods}){

  methods.poll_create__reset = function() {
    data.poll_create = {
      user_id: 'davee',
      question: '',
      options: ['', ''],
      status: ''
    }
    data.poll_create__errs = []
    data.poll_create__option_blank = false
  }

  methods.poll_create__add_option = function(){
    this.poll_create.options.push('')
  }
  methods.poll_create__remove_option = function(i){
    this.poll_create.options.splice(i, 1)
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
    var poll = poll_map(vm.poll_create)
    vm.poll_create__errs = type_validation.poll(poll)
    _check_for_blank(vm.poll_create__errs)
    vm.$forceUpdate()
    return poll
  }

  methods.poll_create__post = function(){
    let vm = this
    var poll = vm.poll_create__validate()
    if (vm.poll_create__errs.length === 0) {
      vm.ws_run({
        cmd: 'poll_create',
        data: {
          poll: poll
        }
      }).then(function(o){
        if (o.res.err === undefined) {
          console.log('why me')
          o.res.data.poll.user_view = {}
          vm.polls.unshift( o.res.data.poll )
        }
      })
    }
    // TODO if any field invalid underline red
    // icon explanaition mark,
    // err message underneith
  }

  methods.poll_create__reset()
  data.poll_create.question = 'Should the United Kingdom Leave the European Union?',
  data.poll_create.options[0] = 'no the UK should Bremain in the EU',
  data.poll_create.options[1] = 'yes the UK should Brexit the EU'
}

/*
{
  cmd: 'poll_create',
  data: {
    poll: {
      question: vm.poll_create.question,
      user_id: vm.poll_create.user_id,
      options: vm.poll_create.options.reduce(function(arr, option){
        if (option.value.length > 0) {
          arr.push(option.value)
        }
        return arr
      }, [])
    }
  }
*/
