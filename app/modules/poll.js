module.exports = function({data, methods}) {
  methods.poll1reset = function() {
    data.polls.push({
      _id: 'abc',
      question: `Should the United Kingdom Leave the European Union?`,
      user_id: 'davee',
      creation_date: new Date('2016-06-23'),
      options: [
        // example option
        {option: 'no the UK should Bremain in the EU', user_id: 'james', creation_date: new Date('2016-10-08')},
        {option: 'yes the UK should Brexit the EU', user_id: 'james', creation_date: new Date('2016-10-08')}
      ],
      votes: [],
      user_view: {
        vote_tick: null
      }
    })
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
