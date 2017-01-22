function type_validate_poll(o) {
  let errs = []
  if (typeof o.question !== 'string') {
    errs.push({
      field: 'question',
      msg: 'question type must be a string'
    })
  }
  else if (o.question.split(/ |\n/).join('').length) {
    errs.push({
      field: 'question',
      msg: 'question needs more than 8 letters'
    })
  }

  if (typeof o.user_id !== 'string'){
    errs.push({
      field:'user_id',
      value: 'user_id isnt a string'
    })
  }
  if (o.user_id.length <= 0) {
    errs.push({
      field: 'user_id',
      msg: 'user_id is small'
    })
  }

  if (Array.isArray(o.options) !== true) {
    errs.push({
      field: 'options',
      msg: 'options isnt an array'
    })
  }

  return {field: 'poll', errs, valid: errs.length === 0, input_object: o}
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
  poll: type_validate_poll,
  option: validate_option,
  vote: validate_option
}
