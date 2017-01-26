function flatten(arr) {
  var ans = []
  arr.forEach(function(ar){
    if ( Array.isArray(ar) ) { ans = ans.concat( flatten(ar) ) }
    else { ans.push(ar) }
  })
  return ans
}
function namespaceErr(name){return function(err) {
  err = JSON.parse(JSON.stringify(err))
  err.field =  name+'.'+err.field
  return err
}}

function arr_typevalid(fieldname, validators) {return function(arr){
  if (Array.isArray(arr) !== true) {
    return [{
      field: fieldname,
      msg: fieldname +' input isnt an array',
      input: arr
    }]
  }
  return flatten(arr.map(function(option, i){
    return Object.keys(validators).map(function(name){
      if (name === '{}') { // denotes root and not property
        return validators[name](option)
      }
      return validators[name](option[name])
    }).map(function(err){
      err.i = i
      return err
    })
  }) )
}}
function obj_typevalid(fieldname, validators) {return function(obj) {
  // validators is an obj of functions
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return [{
      field: fieldname,
      msg: fieldname + ' input isnt a object.',
      input: obj
    }]
  }
  return flatten(Object.keys(validators).map(function(name){
    return validators[name]( obj[name] )
  }) ).map(namespaceErr(fieldname))
}}

function optional_prop(validator){
  return function(whatever) {
    if (whatever === undefined) {return []}
    return validator(whatever)
  }
}
// validators
// each validator will return array of errs
v = {}

// primitive validations
v.user_id = function(str) {
  var errs = []
  if (typeof str !== 'string'){
    errs.push({
      field: 'user_id',
      value: 'user_id isnt a string',
      input: str
    })
  }
  else if (str.length <= 0) {
    errs.push({
      field: 'user_id',
      msg: 'user_id is small',
      input: str
    })
  }
  return errs
},
v.creation_date = function(date) {
  var errs = []
  if ((new Date(date)).toString() === 'Invalid Date' ) {
    errs.push({
      field: 'creation_date',
      msg: 'invalid date',
      input: date
    })
  }
  return errs
}
v.option_str = function(str) {
  var errs = []
  if (typeof str !== 'string') {
    return [{
      field: 'option_str',
      msg: 'option isnot a string',
      input: str
    }]
  }
  str = str.trim()
  if (str === '') {
    errs.push({
      field: 'option_str',
      msg: 'option is blank',
      input: str
    })
  }
  return errs
}
v.question = function(str){
  var errs = []
  if (typeof str !== 'string') {
    errs.push({
      field: 'question',
      msg: 'question isnot a string',
      input: str
    })
  }
  else if (str.split(' ').join('').length <= 8) {
    errs.push({
      field: 'question',
      msg: 'question needs more than 8 letters',
      input: str
    })
  }
  return errs
}

// secondary validations
v.option = obj_typevalid('option', {
  user_id: v.user_id,
  creation_date: v.creation_date,
  option: v.option_str
})

v.options = arr_typevalid('options', {
  '{}': v.option
})

v.poll = obj_typevalid('poll', {
  user_id: v.user_id,
  creation_date: v.creation_date,
  options: v.options,
  question: v.question
})

v.vote = obj_typevalid('vote', {
  option: v.option_str,
  creation_date: v.creation_date,
  user_id: optional_prop(v.user_id)
})

module.exports = v
