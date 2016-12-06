module.exports = function(o) {
  return function(option){
    if (typeof option === 'string') {
      return {option: option, user_id: o.user_id, creation_date: o.creation_date}
    }
    return option
  }
}
