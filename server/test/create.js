module.exports = (client, next) => {
  client
    .invokeApi({}, '', 'POST', {headers: {}}, {
      content: 'test centent',
      user: 'test user',
      uri: 'https://test-uri.com',
      date: (new Date).toISOString(),
    })
    .then((res) => {
      if (res.status === 200) {
        console.log('data added')
        if (next) next(client)
      } else {
        console.warn('error->', res.statusText)
      }
    })
    .catch((e) => {
      console.warn(e)
    })
}
