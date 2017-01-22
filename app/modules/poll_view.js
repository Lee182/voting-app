module.exports = function({data, methods}) {
  data.polls = []
  methods.poll1reset = function() {
    data.polls = []
  }
  methods.vote_tick = function(poll, option) {
    // check if option in array
    var option_exists = poll.options.find(function(item){
      return item.option === option
    })
    if (option_exists === undefined) {return}

    if (poll.user_view.vote_tick === option) {
      // untick a vote
      poll.user_view.vote_tick = null
    } else {
      // tick a vote box
      poll.user_view.vote_tick = option
    }
  }

  methods.vote_cast = function(poll) {
    if (poll.user_view.vote_tick === null) {return}
    // send the vote
    console.log('vote_cast TODO')
  }

  methods.poll1reset()

}
