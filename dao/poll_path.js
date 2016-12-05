var build = require('./poll_build.js')
o = build({
  question: 'Whats your favourite color',
  user_id: 'dave',
  creation_date: new Date()
})
console.log(o)
