var fn_chartmap = require('./fn_chartmap.js')
module.exports = function({data, methods}) {
  data.polls = []
  data.poll_charts = {}
  data.poll_view__anom_voters_view = 'all'
  methods.poll_view__reset = function() {
    this.polls = []
  }

  methods.poll_view__vote_check = function(poll, option) {
    let vm = this
    const prop = vm.user_id === undefined ? 'ip' : 'user_id'
    return poll.votes[prop].option === option
  }

  methods.poll_view__vote_tick = function(poll, option) {
    let vm = this
    const option_exists = poll.options.find(function(item){
      return item.option === option
    })
    if (option_exists === undefined) {return}

    const prop = vm.user_id === undefined ? 'ip' : 'user_id'

    if (poll.votes[prop].option === option) {
      // untick a vote
      poll.votes[prop].option = undefined
    } else {
      // tick a vote box
      poll.votes[prop].option = option
    }
    vm.$forceUpdate()
  }


  methods.poll_view__vote_cast = function(poll) {
    let vm = this
    const prop = vm.user_id === undefined ? 'ip' : 'user_id'
    if (poll.votes[prop].option === undefined) {return}

    var vote = {
      option: poll.votes[prop].option,
      creation_date: new Date()
    }
    if (vm.user_id !== undefined) {
      vote.user_id = vm.user_id
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
      vm.$forceUpdate()
    })
  }

  methods.poll_view__addpoll = function(poll){
    let vm = this
    vm.polls.unshift( poll )
    vm.poll_view__chartmap( poll )
  }

  methods.poll_view__anom_voter_tog = function() {
    let vm = this
    var a = this.poll_view__anom_voters_view
    if (a === 'all') {
      vm.poll_view__anom_voters_view = 'no_anom'
    } else if (a === 'no_anom') {
      vm.poll_view__anom_voters_view = 'all'
    }
    vm.$forceUpdate()
    // Object.keys(vm.poll_charts).forEach(function(id){
    // })
  }

  methods.poll_view__chartmap = function(poll) {
    let vm = this
    var chart = fn_chartmap(poll, vm.poll_view__anom_voters_view)
    console.log('chart',chart)
    vm.poll_charts[poll.id] = chart
  }
}
