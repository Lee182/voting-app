const express = require('express')
const app = express()
var port = process.env.PORT || 3000

app.use('/', express.static(__dirname + '/dist'))

app.listen(port, function(){
  console.log('server listening at http://localhost:'+port)
})
