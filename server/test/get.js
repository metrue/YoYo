module.exports = (client, next) => {
  client
    .invokeApi(
      {
        uri: 'https://test-uri.com'
      }, '/?uri={uri}', 'GET', {headers: {}}, {})
    .then((res) => {
      if (res.status === 200) {
        console.log('data got: ', JSON.stringify(res.data, null, 2))
        if (next) next(client)
      } else {
        console.warn('error->', res.statusText)
      }
    })
    .catch((e) => {
      console.warn(e)
    })
}
