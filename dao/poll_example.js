module.exports = {
  // _id: 'asigned by mongodb'
  question: 'What is your favorite color this year?',
  user_id: 'dave',
  creation_date: new Date('2016-10-08'),
  options: [
    // example option
    {option: 'blue', user_id: 'james', creation_date: new Date('2016-10-08')},
    {option: 'red', user_id: 'james', creation_date: new Date('2016-10-08')},
  ],
  votes: [
    // example vote
    {option: 'blue', user_id: 'dave', creation_date: new Date('2016-10-09')},
    {option: 'blue', user_id: 'thersa_', creation_date: new Date('2016-10-09')},
    // example anomynous vote
    {option: 'red', creation_date: new Date('2016-10-09')},
    {option: 'red', creation_date: new Date('2016-10-09')},
    {option: 'red', creation_date: new Date('2016-10-09')}
  ]
}
