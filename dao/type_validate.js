function validate_poll(o) {
  let errs = []
  if (typeof o.question !== 'string') {
    errs.push('question type must be a string')
  }
  else if (o.question < 8) {
    errs.push('question must be longer than 8 chars')
  }
  if (typeof o.user_id !== 'string'){
    err.push('user_id isnt a string')
  }
  if (Array.isArray(o.options) !== true) {
    errs.push('options isnt an array')
  } else {
    // filter out options so only unique choices
    o.options = o.options.reduce(function(arr, cur){
      var option_validness = validate_option(cur.option).valid
      if (arr.findIndex(function(b){
        b.option === cur.option
      }) === -1) {
        option_validness = false
      }
      if (option_validness === true) {
        arr.push(cur)
      }
      return arr
    }, [])
  }
  if ( notBoolean(o.anomynous_can_add_option) ){
    errs.push('anomynous_can_add_option not Boolean')
  }
  if ( notBoolean(o.anomynous_can_vote) ){
    errs.push('anomynous_can_vote not Boolean')
  }
  if ( notBoolean(o.takein_new_votes) ){
    errs.push('takein_new_votes not Boolean')
  }
  if (Array.isArray(o.visibility)){
    var eachisStr = o.visibility.reduce(function(bool, cur){
      if (typeof cur !== 'string') {
        bool = false
      }
      return bool
    }, true)
    if (eachisStr === false) {
      errs.push('user_ids in visibility array are not a strings')
    }
  }
  return {field: 'poll', errs, valid: errs.length === 0}
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
  return {field: 'option', errs, valid: errs.length === 0}
}

module.exports = {
  poll: validate_poll,
  option: validate_option,
  vote: validate_option
}
