const clientFactory = require('aws-api-gateway-client')

const client = clientFactory.newClient({
  apiKey: '4E1FsTSmw72ivqJa6MZev9mKfMRYWQsv44szEXKc',
  region: 'us-west-2',
  invokeUrl: 'https://4m84jkfe6e.execute-api.us-west-2.amazonaws.com/beta'
})

client
  .invokeApi(
    {
      uri: 'https://minghe.me'
    },
    '',
    'GET',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      // queryParams: {
      //   uri: 'https://minghe.me',
      // }
    },
    {}
  )
  .then((res) => {
    if (res.status === 200) {
      console.log('data got', JSON.stringify(res.data, null, 2))
    } else {
      console.warn('error->', res.statusText)
    }
  })
  .catch((e) => {
    console.warn(e)
  })
