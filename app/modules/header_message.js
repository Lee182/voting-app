module.exports = function({data, methods}) {
  data.header_messages = []
  data.header_message_text = null

  methods.header_message_add = function({msg, action_fn}){
    // data.header_messages.push({msg, action_fn})
    data.header_message_text = '4 new polls made. click to show.'
  }

  methods.header_message_onclick = function(e) {
    data.header_message_text = null
  }

  methods.header_message_beforeEnter = function(el, done){
    // Velocity(el, 'transition.bounceRightIn', { duration: 1000 }).then(done)
  }
  methods.header_message_enter = function(el, done){
    Velocity(el, 'transition.slideDownBigIn', {duration: 1000}).then(
    function(el){
      return Velocity(el, 'callout.bounce', {duration: 1000})
    }).then(done)
  }
  methods.header_message_leave = function(el, done){
    // see Velocity.Redirects
    Velocity(el, 'transition.slideUpBigOut', { duration: 1000 }).then(done)
  }


  // wait(1000).then(function(){
  //   vm.header_message_add({})
  // })
}
