var type_validate = require('../../app/browser+node/type_validation.js')
var sort_creation_date = require('./fn_sort_creation_date.js')

// remove invalid options from the options array
module.exports = function(options) {
  return options
  .sort(sort_creation_date)
  .reduce(function(arr,option){
    const option_validness = type_validate.option(option)
    const i = arr.findIndex(function(o2){
      return o2.option === option.option
    })
    if (option_validness.valid === true && i === -1) {
      arr.push(option)
    }
    return arr
  },[])
}
