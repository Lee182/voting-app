module.exports = function({data, methods}) {
  data.polls = []
  methods.poll_view__reset = function() {
    this.polls = []
  }
  methods.poll_view__vote_tick = function(poll, option) {
    // check if option in array
    var option_exists = poll.options.find(function(item){
      return item.option === option
    })
    if (option_exists === undefined) {return}

    if (poll.user_view.vote_tick === option) {
      // untick a vote
      poll.user_view.vote_tick = undefined
    } else {
      // tick a vote box
      poll.user_view.vote_tick = option
    }
    this.$forceUpdate()
  }

  methods.poll_view__vote_cast = function(poll) {
    if (poll.user_view.vote_tick === undefined) {return}
    let vm = this
    var vote = {
      option: poll.user_view.vote_tick,
      creation_date: new Date()
    }
    if (vm.user_id || true) {
      vote.user_id = 'davee'
    }
    vm.ws_run({cmd: 'poll_vote', data: {
      vote: vote,
      poll_id: poll.id
    }}).then(function(o){
      console.log(o)
      var i = vm.polls.findIndex(function(poll){
        return poll.id === o.res.poll.id
      })
      vm.polls[i] = o.res.poll
      console.log(vm.polls[0])
      vm.$forceUpdate()
    })
  }

  methods.poll_view__addpoll = function(poll){
    poll.user_view = {}
    vm.polls.unshift( poll )
  }
}
