function poll_build(o) {
  // o.question,
  // o.user_id,
  // o.creation_date,
  // o.options,
  // o.anomynous_can_add_option,
  // o.anomynous_can_vote,
  // o.visibility,
  // o.takein_new_votes
  if (Array.isArray(o.options) === false) {
    o.options = []
  }
  o.options = o.options.map(function(option){
    if (typeof option === 'string') {
      return {option, user_id, creation_date}
    }
    return option
  })
  if (o.anomynous_can_add_option === undefined) {
    o.anomynous_can_add_option = false
  }
  if (o.anomynous_can_vote === undefined) {
    o.anomynous_can_vote = true
  }
  if (o.takein_new_votes === undefined) {
    o.takein_new_votes = true
  }
  return {
    question: o.question,
    user_id: o.user_id,
    creation_date: o.creation_date,
    options: o.options,
    votes: [],
    anomynous_can_add_option: Boolean(o.anomynous_can_add_option),
    anomynous_can_vote: Boolean(o.anomynous_can_vote),
    visibility: o.visibility || 'public',
    takein_new_votes: Boolean(o.takein_new_votes)
  }
}

module.exports = poll_build
// purpose to fill in the gaps
