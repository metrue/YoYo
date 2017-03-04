webpack = require 'webpack'
path    = require 'path'

#ExtractTextPlugin = require 'extract-text-webpack-plugin'

APP_ROOT = path.join(__dirname, '..')

module.exports =
  devtool: 'eval'

  entry:
    index: [
      'babel-polyfill'
      "#{APP_ROOT}/ui/index.jsx"
    ]

  devServer:
    contentBase: "#{APP_ROOT}/public"
    hot: true
    inline: true
    progress: true
    historyApiFallback: true
    color: true

  output:
    publicPath: '/dist/'
    path:     path.join(APP_ROOT, 'public', 'dist')
    filename: '[name].js'
    sourceMapFilename: '[file].map'

  resolve:
    extensions: [ '', '.js', '.jsx', '.less', '.css' ]

  module:
    loaders: [
      { test: /\.json$/, loader: 'json-loader' }

      # {
      #   test: /\.less$/,
      #   #exclude: /(node_modules|bower_components)/
      #   loader: 'style!css!less'
      #   #loader: ExtractTextPlugin.extract('style', 'css!less')
      # }

      # {
      #   test: /modal_input\/style\.css$/,
      #   loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      # }
      {
        test: /site\.css$/,
        loader: 'style!css'
      }
      {
        test: /\.css$/,
        exclude: /site\.css$/
        loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      }
      # {
      #   test: /SearchBox\/style\.css$/,
      #   loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      # }
      # {
      #   test: /Home\/style\.css$/,
      #   loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      # }
      #
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'file' }
      {
        test:    /\.jsx?$/
        exclude: /(node_modules|bower_components)/
        loader:  'babel'
        query: {
          presets: [ 'es2015', 'stage-0', 'react' ]
          plugins: [ 'transform-decorators-legacy' ]
          cacheDirectory: true
        }
      }
      {
        test   : /\.woff|\.woff2|\.svg|.eot|\.ttf/,
        loader : 'url?prefix=font/&limit=10000'
      }
    ]

  plugins: [
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: require('./react-manifest.json'),
    }),

    new webpack.DllReferencePlugin({
      context: '.',
      manifest: require('./utils-manifest.json'),
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),

    new webpack.HotModuleReplacementPlugin()

    #new ExtractTextPlugin("[name].css")
  ]
