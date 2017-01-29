module.exports = function(poll, voters) {
  var rows = poll.votes[voters].map(function(i){
    return [i.option, i.count]
  })
  return {
    type: 'PieChart',
    columns: [{
        'type': 'string',
        'label': 'Option'
    }, {
        'type': 'number',
        'label': 'Count'
    }],
    rows: rows,
    options: {
        hAxis: {
            title: 'Option',
            minValue: '2004',
            maxValue: '2007'
        },
        vAxis: {
            title: 'Count',
            minValue: 300,
            maxValue: 1200
        },
        width: 290,
        backgroundColor: {
          fill:'#DFDFDF',
        },
        // title: 'Company Performance',
        // height: 500
    }
  }

}
