const webpack = require('webpack');

module.exports = {
  entry: {
    react: [
      'react',
      'react-router',
      'react-dom',
      'redux',
      'react-redux',
      'redux-saga',
      'redux-immutable',
      'react-router-redux',
    ],
    utils: [
      'immutable',
      'ajax-promise',
      'babel-plugin-transform-runtime',
      'babel-polyfill',
      'babel-regenerator-runtime',
    ],
  },

  output: {
    filename: '[name].bundle.js',
    path: 'public/dist/',
    library: '[name]_lib',
  },

  plugins: [
    new webpack.DllPlugin({
      path: 'config/[name]-manifest.json',
      name: '[name]_lib',
    }),
  ],
};
