function validate_poll(o) {
  let errs = []
  if (typeof o.question !== 'string') {
    errs.push('question type must be a string')
  }
  else if (o.question.length < 8) {
    errs.push('question must be longer than 8 chars')
  }
  if (typeof o.user_id !== 'string'){
    errs.push('user_id isnt a string')
  }
  if (o.user_id.length <= 0) {
    errs.push('user_id is small')
  }
  if (Array.isArray(o.options) !== true) {
    errs.push('options isnt an array')
  }
  return {field: 'poll', errs, valid: errs.length === 0, o: o}
}

function notBoolean(bool) {
  return !(bool === true || bool === false)
}

function validate_option(o) {
  let errs = []
  if (typeof o.option !== 'string' ||
      o.option === ''
  ) {
    errs.push('option not a string')
  }
  if ((new Date(o.creation_date)).toString() === 'Invalid Date') {
    errs.push('creation_date invalid')
  }
  return {field: 'option', errs, valid: errs.length === 0, o: o}
}

module.exports = {
  poll: validate_poll,
  option: validate_option,
  vote: validate_option
}
