const clientFactory = require('aws-api-gateway-client')

const client = clientFactory.newClient({
  apiKey: '4E1FsTSmw72ivqJa6MZev9mKfMRYWQsv44szEXKc',
  region: 'us-west-2',
  invokeUrl: 'https://4m84jkfe6e.execute-api.us-west-2.amazonaws.com/beta'
})

client
  .invokeApi({}, '', 'POST', {
    headers: {
    },
  }, {
    content: 'my test centent by api key',
    user: 'a nother test user-with api key',
    uri: 'https://test-uri.com',
    date: (new Date).toISOString(),
  })
  .then((res) => {
    if (res.status === 200) {
      console.log('data added')
    } else {
      console.warn('error->', res.statusText)
    }
  })
  .catch((e) => {
    console.warn(e)
  })
