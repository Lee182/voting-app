module.exports = function({data, methods}) {
  console.log('here')

  data.chart = {
    type: 'PieChart',
    columns: [{
        'type': 'string',
        'label': 'Year'
    }, {
        'type': 'number',
        'label': 'Sales'
    }],
    rows: [
        ['yes the UK should Bremain in the EU', 1],
        ['no the UK should Bremain in the EU', 5],
    ],
    options: {
        // title: 'Company Performance',
        hAxis: {
            title: 'Year',
            minValue: '2004',
            maxValue: '2007'
        },
        vAxis: {
            title: '',
            minValue: 300,
            maxValue: 1200
        },
        width: 290,
        backgroundColor: {
          fill:'#DFDFDF',
        },
        // height: 500
    }
  }

}
