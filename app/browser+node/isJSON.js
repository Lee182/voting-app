module.exports = function isJSON(o) {
  try {
    JSON.stringify(o)
  } catch(e) {
    return false
  }
  return true
}
