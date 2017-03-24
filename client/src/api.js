import apigClientFactory from 'aws-api-gateway-client'

class API {
  constructor() {
    this.client = apigClientFactory.newClient({
      apiKey: '4E1FsTSmw72ivqJa6MZev9mKfMRYWQsv44szEXKc',
      region: 'us-west-2',
      invokeUrl: 'https://4m84jkfe6e.execute-api.us-west-2.amazonaws.com/beta',
    })
  }

  submit(options) {
    return this.client.invokeApi(
      {},
      '',
      'POST',
      {
        headers: {},
      },
      {
        content: options.content,
        user: options.user,
        uri: options.uri,
        date: options.date,
      })
  }
}

export default new API()
