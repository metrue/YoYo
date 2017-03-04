config = require './webpack.config'

devConfig = Object.assign({}, config)
entries = devConfig.entry.index
entries.unshift 'webpack-dev-server/client?http://localhost:8080'
entries.unshift 'webpack/hot/dev-server'

module.exports = devConfig
