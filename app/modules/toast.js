// depends on jonoShortcuts
// depends on ./lib/toast.js
module.exports = function({data, methods}) {
  data.toast_messages = []
  var toast_message = {
    title: 'Create Poll, invalid',
    message: 'invalid text at question field',
    icon: null
  }
  methods.toast_beforeEnter = function(el){}
  methods.toast_enter = function(el, done){
    Velocity(el, 'transition.bounceRightIn', { duration: 1000 }).then(done)
  }
  methods.toast_leave = function(el, done){
    Velocity(el, 'transition.bounceRightOut', { duration: 1000 }).then(done)
  }

  // methods.toast_style = function(toast_message, i) {
  // // need to calculate the height to draw next box above
  //   return {
  //     right: 0,
  //     bottom: (i*77.6)+'px',
  //   }
  // }
  methods.toast_count = function(n){
    if (n < 0) {return}
    let arr = []
    for (var i = 0; i < n; i++) {
      arr[i] = toast_message
    }
    data.toast_messages = arr
  }
}
