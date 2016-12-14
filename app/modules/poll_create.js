module.exports = function({data, methods, ws}){

  methods.poll_create_reset = function() {
    data.poll_create = {
      user_id: '',
      question: '',
      options: [{value:''}, {value:''}],
      status: ''
    }
  }

  methods.poll_create_add_option = function(){
    this.poll_create.options.push({value:''})
  }

  methods.poll_create_post = function(){
    let vm = this
    if (vm.ws.disconnected === true) {
      vm.poll_create.status = 'disconnected'
      return
    }
    vm.ws.emit('run', {
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
    })


  }

  methods.poll_create_reset()
  return undefined
}
