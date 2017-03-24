const clientFactory = require('aws-api-gateway-client')

const client = clientFactory.newClient({
  accessKey: 'AKIAIJLWH4IFCY5GBTTQ',
  secretKey: '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',
  region: 'us-west-2',
  invokeUrl: 'https://4m84jkfe6e.execute-api.us-west-2.amazonaws.com/beta'
})

client
  .invokeApi({}, '', 'POST', {}, {
    content: 'my test centent',
    user: 'a nother test user',
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
