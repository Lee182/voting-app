// https://apps.twitter.com/app/new
const logtwit = require('login-with-twitter')
const k = require('./keys.js')

module.exports = function(app, dao, port) {


const tw = new logtwit({
  consumerKey: process.env.TW_CON_KEY || k.twitter.consumerKey,
  consumerSecret: process.env.TW_CON_SEC || k.twitter.consumerSecret,
  callbackUrl: 'http://localhost:'+port+'/twitter-callback'
})

_tw_tokens = {}
app.get('/twitter', function(req,res,next){
  tw.login(function(err, tokenSecret, url){
    var oauth_token = url.split('oauth_token=')[1]
    _tw_tokens[oauth_token] = tokenSecret
    res.redirect(url)
  })
})
app.get('/twitter-callback', function(req, res, next){
  var oauth_token = req.query.oauth_token
  var oauth_token_secret = _tw_tokens[oauth_token]
  if (oauth_token_secret === undefined) {
    return res.redirect('/')
  }
  tw.callback({
    oauth_token,
    oauth_verifier: req.query.oauth_verifier
  },
  oauth_token_secret,
  function(err, user){
    if (err) {return res.redirect('/')}
    delete _tw_tokens[oauth_token]
    console.log(user)
    res.cookie('twitter', user.userToken,
      {/*maxAge: 900000,*/ httpOnly: true})
    dao.db.collection('polls_sessions')
      .insert({
        _id: user.userToken,
        creation_date: new Date(),
        user_id: user.userName
        // https://twitter.com/${userName}/profile_image
      })
      .then(function(result){
        console.log(result)
        res.redirect('/')
      })
      .catch(function(err){
        console.log(err.message)
        res.status(500)
        res.redirect('/')
      })
  })
})

app.post('/twitter-logout', function(req,res,next){
  console.log('twitter-logout',req.cookies)
  dao.db.collection('polls_sessions').remove({
    _id: req.cookies.twitter
  }).then(function(a){
    console.log(a.result.n, 'removed session')
  })
  res.clearCookie('twitter', { path: '/' })
  res.json({logout: true})
})


}
