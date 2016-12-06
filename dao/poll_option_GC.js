var type_validate = require('./type_validate')
var sort_creation_date = require('./fn_sort_creation_date.js')

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
