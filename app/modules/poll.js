module.exports = function({data, methods}) {
  methods.poll1reset = function() {
    data.poll = {
      question: `Should the United Kingdom Leave the European Union?`,
      user_id: 'davee',
      creation_date: new Date('2016-06-23'),
      options: [
        // example option
        {option: 'no the UK should Bremain in the EU', user_id: 'james', creation_date: new Date('2016-10-08')},
        {option: 'yes the UK should Brexit the EU', user_id: 'james', creation_date: new Date('2016-10-08')}
      ],
      votes: [],
      vote_tick: undefined
    }
  }
  methods.vote_tick_fn = function(poll, option) {
    console.log('vote_tick', poll, option)
    // check if option in array
    var option_exists = poll.options.find(function(item){
      return item.option === option
    })
    if (option_exists === undefined) {
      return
    }
    if (poll.vote_tick === option) {
      poll.vote_tick = undefined
    } else {
      poll.vote_tick = option
    }
  }

  methods.poll1reset()

}
