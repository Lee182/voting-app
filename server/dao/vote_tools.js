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
}
function isAnomVote(vote) {
  return vote.user_id === undefined
}
function isnotAnomVote(vote) {
  return vote.user_id !== undefined
}

function votes_aggregate(votes, user_id){
  var o = {
    all: votes.reduce(aggregate, []),
    anom: votes.filter(isAnomVote).reduce(aggregate, []),
    no_anom: votes.filter(isnotAnomVote).reduce(aggregate, [])
  }
  if (user_id !== undefined) {
    var user_vote = votes.find(function(vote){
      vote.user_id === user_id
    })
    o.user_vote = user_vote
  }
  return o
}

function votes_has_user_id(votes, user_id){
  return votes.find(function(vote){
    return vote.user_id === user_id
  })
}

function votes_has_ip(votes, ip){
  return votes.find(function(vote){
    return vote.user_id === undefined && vote.ip === ip
  })
}

// votes
module.exports = {
  aggregate: votes_aggregate,
  has_ip: votes_has_ip,
  has_user_id: votes_has_user_id
}
