var fn_chartmap = require('./fn_chartmap.js')
module.exports = function({data, methods}) {
  data.polls = {}
  data.poll_view__anom_voters_view = 'all'
  data.polls_inview = []
  methods.poll_view__reset = function() {
    this.polls = []
    this.poll_view__anom_voters_view = 'all'
  }

  methods.poll_view__update = function() {
    let vm = this
    vm.polls_inview = Object.keys(vm.polls).map(function(id){
      return vm.polls[id].poll
    })
  }

  methods.poll_view__vote_check = function(poll, option) {
    let vm = this
    const prop = vm.user_id === undefined ? 'ip' : 'user_id'
    return poll.votes[prop].option === option
  }

  methods.poll_view__voted = function(poll) {
    let vm = this
    var prop = vm.user_id === undefined ? 'ip' : 'user_id'
    return poll.votes[prop].option !== undefined
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
      vm.poll_view__addpoll(o.res.poll)
      vm.$forceUpdate()
    })
  }

  methods.poll_view__addpoll = function(poll){
    let vm = this
    if (vm.polls[poll.id] === undefined) {
      vm.polls[poll.id] = {
        poll: {},
        chart: {},
        showresults: false,
        resultsview: 'n' // pie
      }
    }
    vm.polls[poll.id].poll = poll
    vm.poll_view__chartmap( poll )
    vm.poll_view__update()
  }

  methods.poll_view__showresults = function(poll_id, bool) {
    let vm = this
    console.log(poll_id, bool)
    vm.polls[poll_id].showresults = Boolean(bool)
    if (bool === 'pie' || bool === 'n') {
      vm.polls[poll_id].resultsview = bool
    }
    vm.$forceUpdate()
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
    Object.keys(vm.polls).forEach(function(id){
      vm.poll_view__chartmap(vm.polls[id].poll)
    })
  }

  methods.poll_view__chartmap = function(poll) {
    let vm = this
    var chart = fn_chartmap(poll, vm.poll_view__anom_voters_view)
    vm.polls[poll.id].chart = chart
  }
}
