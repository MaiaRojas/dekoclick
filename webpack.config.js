'use strict';


const Path = require('path');
const Webpack = require('webpack');


module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'public/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    hot: true,
    contentBase: Path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.NamedModulesPlugin(),
  ]
};
