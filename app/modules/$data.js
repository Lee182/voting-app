module.exports = function({methods, data}) {
  var versions = []
  methods.data_lines = function(o){
    let vm = this
    let l = JSON.parse(JSON.stringify(o))
    delete l.dataline
    let txt = JSON.stringify(l, null, 2)
    versions.push( txt.split('\n') )
    return txt
  }
}
