var poll_option_map = require('./poll_map__option.js')
var poll_map__option_GC = require('./poll_map__option_GC.js')

module.exports = function(o, bool) {
  o = JSON.parse(JSON.stringify(o))
  if (o.creation_date === undefined) {
    o.creation_date = new Date()
  }
  if (Array.isArray(o.options) === false) { o.options = [] }
  o.options = o.options.map(poll_option_map(o))
  if (bool === true) {
    o.options = poll_map__option_GC(o.options)
  }

  return {
    question: o.question,
    user_id: o.user_id,
    creation_date: o.creation_date,
    options: o.options,
    votes: [],
  }
}
