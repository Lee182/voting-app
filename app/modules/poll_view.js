var fn_chartmap = require('./fn_chartmap.js')
module.exports = function({data, methods}) {
  data.polls = {}
  data.poll_view__anom_voters_view = 'all'
  data.polls_inview = []

  methods.poll_view__reset = function() {
    this.polls = {}
    this.poll_view__anom_voters_view = 'all'
    this.poll_view__refresh()
  }

  methods.poll_view__refresh = function() {
    let vm = this
    vm.polls_inview = Object.keys(vm.polls).map(function(id){
      return vm.polls[id]
    })
  }

  methods.poll_view__addpoll = function(poll){
    let vm = this
    if (vm.polls[poll.id] === undefined) {
      vm.polls[poll.id] = {
        poll: {},
        chart: {},
        view_settings: false,
        view_results: false,
        view_results_mode: 'n' // pie
      }
    }
    vm.polls[poll.id].poll = poll
    vm.poll_view__chartmap( poll )
    vm.poll_view__refresh()
  }

  methods.poll_view__remove_poll = function(poll_id) {
    let vm = this
    delete vm.polls[poll_id]
    vm.poll_view__refresh()
  }



  methods.poll_view__settings_toggle = function(poll){
    let vm = this
    vm.polls[poll.id].view_settings = !vm.polls[poll.id].view_settings
  }

  methods.remove_poll_option = function(poll) {
    var options = poll.options.map(function(o){
      return o.option
    })
    var optionstr = options.reduce(function(str, option, i){
      return str += '\n  ' + (i+1) + '. ' + option
    }, `for question\n  ""${poll.question}""  \ntype in 1 or 2 or 3... to select the option you want to remove\n`)
    var p = prompt(optionstr)
    p = Number(p)-1
    if ( isNaN(p) || options[p] === undefined ){return}
    vm.ws_run({cmd: 'poll_option_remove', data:{
      poll_id: poll.id,
      option: options[p]
    }}).then(function(o){
      console.log(o)
      if (o.res.poll) {
        vm.poll_view__addpoll(o.res.poll)
      }
    })
  }
  methods.add_poll_option = function(poll) {
    var newoption = prompt(`type a new option for question\n ""${poll.question}""\n`)
    if (typeof newoption !== 'string') {return}
    if ( poll.options.find(function(o){
      o.option === newoption
    }) !== undefined) {return}

    vm.ws_run({cmd: 'poll_option_add', data:{
      option: {
        option: newoption,
        user_id: vm.user_id,
        creation_date: new Date()},
      poll_id: poll.id
    }}).then(function(o){
      console.log(o)
      vm.poll_view__addpoll(o.res.poll)
    })
  }

  methods.delete_poll = function(poll_id) {
    let vm = this
    polltxt = vm.polls[poll_id].poll.question
    var a = confirm(`are you sure you want to delete this poll\n""${polltxt}""`)
    if (a === false) { return }

    vm.ws_run({cmd: 'poll_remove', data:{
      poll_id: poll_id
    }}).then(function(o){
      console.log(o)
      if (o.res.result && o.res.result.n === 1) {
        vm.poll_view__remove_poll(o.res.poll_id)
      }
    })
  }



  methods.poll_view__votestamp = function(poll, option) {
    let vm = this
    const prop = vm.user_id === undefined ? 'ip' : 'user_id'
    return poll.votes[prop].option === option
  }

  methods.poll_view__vote_tick = function(o, option) {
    let vm = this
    const option_exists = o.poll.options.find(function(item){
      return item.option === option
    })
    if (option_exists === undefined) {return}


    if (o.vote_tick === option) {
      // untick a vote
      o.vote_tick = undefined
      vm.$forceUpdate()
      return
    }
    // tick a vote box
    o.vote_tick = option
    vm.$forceUpdate()
  }

  methods.poll_view__vote_cast = function(poll) {
    let vm = this
    const prop = vm.user_id === undefined ? 'ip' : 'user_id'
    if (vm.polls[poll.id].vote_tick === undefined) {return}

    var vote = {
      option: vm.polls[poll.id].vote_tick,
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

  methods.poll_view__voted = function(poll) {
    let vm = this
    var prop = vm.user_id === undefined ? 'ip' : 'user_id'
    return poll.votes[prop].option !== undefined
  }

  methods.poll_view__showresults = function(o, bool) {
    let vm = this
    o.view_results = Boolean(bool)
    if (bool === 'pie' || bool === 'n') {
      o.view_results_mode = bool
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
