const clientFactory = require('aws-api-gateway-client')
const config = require('./config.json')

module.exports = clientFactory.newClient({
  region: config.region,
  invokeUrl: config.invoke_url,
  apiKey: config.apiKey
})
