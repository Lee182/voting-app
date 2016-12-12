module.exports = function postJSON({url, data, progresscb, cb, cookies}) {
  var req = new XMLHttpRequest()
  req.onreadystatechange = function(e) {
    if (req.readyState === 4) {
      if (typeof cb === 'function')
        cb(req.response)
    }
  }
  if (typeof progresscb === 'function')
    req.upload.addEventListener('progress', progresscb)
  // function(e){
  //   $progress.style.width = Math.ceil(e.loaded/e.total) * 100 + '%';
  // }, false);
  req.withCredentials = Boolean(cookies)
  req.open('POST', url, true)
  req.setRequestHeader('Content-Type', 'application/json')
  if (typeof data !== 'string') {
    data = JSON.stringify(data)
  }
  req.responseType = 'json'
  req.send(data)
}
