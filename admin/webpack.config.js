const webpack = require('webpack')
const path = require('path')

const APP_ROOT = path.join(__dirname, '.')

let devtool = 'inline-source-map'
if (process.env.NODE_ENV === 'production') {
  devtool = false
}

module.exports = {
  devtool,
  entry: {
    index: [
      'babel-polyfill',
      `${APP_ROOT}/src/index.jsx`,
    ],
  },

  devServer: {
    contentBase: `${APP_ROOT}/public`,
    hot: true,
    hotOnly: false,
    inline: true,
    historyApiFallback: true,
  },

  output: {
    publicPath: '/dist/',
    path: path.join(APP_ROOT, 'public', 'dist'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.less', '.css'],
  },

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.css$/,
        exclude: /site\.css$|react-select\.css|bootstrap\.css$|fixed-data-table\.min\.css$|rodal\.css$|plugin\.css$/,
        use: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        ],
      },
      {
        test: /site\.css$|fixed-data-table\.min\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /plugin\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /bootstrap\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /rodal\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /react-select\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'file-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0', 'react'],
            plugins: ['transform-decorators-legacy'],
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
        loader: 'url-loader?prefix=font/&limit=10000',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
    }),
  ],
}
