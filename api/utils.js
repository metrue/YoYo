const trimHTTPOrHTTPS = (url) => {
  const regex = /^http.*\:\/\//gi
  return url.replace(regex, '')
}

module.exports = {
  trimHTTPOrHTTPS,
}
