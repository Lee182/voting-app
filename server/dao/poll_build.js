var poll_option_map = require('./poll_option_map.js')
var poll_option_GC = require('./poll_option_GC.js')

function poll_build(o) {
  o = JSON.parse(JSON.stringify(o))
  if (o.creation_date === undefined) {
    o.creation_date = new Date()
  }
  if (Array.isArray(o.options) === false) { o.options = [] }
  o.options = o.options.map(poll_option_map(o))
  o.options = poll_option_GC(o.options)

  return {
    question: o.question,
    user_id: o.user_id,
    creation_date: o.creation_date,
    options: o.options,
    votes: [],
  }
}

module.exports = poll_build
