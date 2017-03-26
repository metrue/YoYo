const clientFactory = require('aws-api-gateway-client')
const config = require('../config.json')

const client = clientFactory.newClient({
  region: config.region,
  invokeUrl: config.invokeUrl,
  apiKey: config.apiKey
})

client
  .invokeApi(
    {
      uri: 'https://test-uri.com'
    }, '/?uri={uri}', 'GET', {}, {})
  .then((res) => {
    if (res.status === 200) {
      console.log('data got: ', JSON.stringify(res.data, null, 2))
    } else {
      console.warn('error->', res.statusText)
    }
  })
  .catch((e) => {
    console.warn(e)
  })
