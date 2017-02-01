# realtime-voting-app

## description
a realtime voting app that uses the tools vuejs, socket.io, mongodb, expressjs, login-with-twitter.

## install
```shell
# if NODE_ENV isn't set to 'PRODUCTION' devDependencies will be installed
$ npm install
```
## server/keys.js file
it is import to create a file called keys which resembles this format.
```
module.exports = {
  mongourl: 'mongodb://[user]:[pwd]@yourdomain.com:[port]/[db_name]',
  twitter: {
    consumerKey: 'xxxxxxxxxxxxxxxxxxxxxxxxx',
    consumerSecret:'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  }
}
```
twitter oauth keys can be obtainend from https://apps.twitter.com/app/new

## running dev mode,
app/** file changes are watched then compiled to dist
```
$ npm run start-dev
```

## running normally
$ npm run start

## Licence & Author
Author: Jonathan T L Lee, <jono-lee@hotmail.co.uk>

Licence: MIT
