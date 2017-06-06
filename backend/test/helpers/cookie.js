module.exports = function cookie(rawString) {
  const [tokenString, path, expires] = rawString.split('; ')
  const [key, value] = tokenString.split('=')

  const token = {}
  token[key] = value

  return {
    token,
    path: path.split('=')[1],
    expires: expires.split('=')[1],
  }
}
