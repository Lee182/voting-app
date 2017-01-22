var poll_build = require('../../server/dao/poll_build.js')

module.exports = function({data, methods}){

  methods.poll_create__reset = function() {
    data.poll_create = {
      user_id: 'davee',
      question: '',
      options: ['', ''],
      status: ''
    }
  }

  methods.poll_create__add_option = function(){
    this.poll_create.options.push({value:''})
  }
  methods.poll_create__remove_option = function(i){
    poll_create.options.splice(i, 1)
  }

  methods.poll_create__post = function(){
    let vm = this
    var poll = poll_build(vm.poll_create)
    debugger
    // TODO validate poll_create fields
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
