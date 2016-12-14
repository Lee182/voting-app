/*
votes = [
  // example vote
  {option: 'blue', user_id: 'dave', creation_date: new Date('2016-10-09')},
  {option: 'blue', user_id: 'thersa_', creation_date: new Date('2016-10-09')},
  // example anomynous vote
  {option: 'red', creation_date: new Date('2016-10-09')},
  {option: 'red', creation_date: new Date('2016-10-09')},
  {option: 'red', creation_date: new Date('2016-10-09')}
]
to ---->
votes_aggregated = {
  all: [
    {option: 'blue', count: 2}
    {option: 'red', count: 3}
  ],
  filterout_anom: [
    {option: 'blue', count: 2}
  ]
}
*/
function aggregate(arr, vote){
  var i = arr.findIndex(function(item){
    return item.option === vote.option
  })

  if (i === -1) {
    arr.push({option: vote.option, count: 1})
  } else {
    arr[i].count++
  }

  return arr
})
function isAnomVote() {
  return vote.user_id === undefined
}

module.exports = function(){
  return {
    all: votes.reduce(aggregate),
    filterout_anom: votes.filter(isAnomVote).reduce(aggregate),
  }
}
