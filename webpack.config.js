'use strict';


const Path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const extractTextWebpackPlugin = new ExtractTextWebpackPlugin({
  filename: 'main.css'
});

const isProduction = process.env.NODE_ENV === 'production';
const targetPathRel = 'dist';
const targetPathAbs = Path.resolve(__dirname, targetPathRel);


module.exports = {
  context: Path.resolve(__dirname, 'src'),
  entry: ['./index.js'],
  output: {
    filename: 'bundle.js',
    path: targetPathAbs,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          query: {
            presets:[ 'es2015', 'react', 'stage-2' ]
          }
        }]
      },
      {
        test: /\.scss$/,
        use: extractTextWebpackPlugin.extract({
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader'
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      {
        test: /\.(svg|png|jpg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img/',
              publicPath: 'img/'
            }
          }
        ]
      },
      {
        test: /worker\.js$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '',
              publicPath: ''
            }
          }
        ]
      },
      {
        test: /CNAME$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]',
              outputPath: '',
              publicPath: ''
            }
          }
        ]
      }
    ]
  },
  plugins: [
    extractTextWebpackPlugin,
    new Webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html'
    }),
  ]
};


if (!isProduction) { // Development environment

  module.exports.entry = [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8081',
    'webpack/hot/only-dev-server'
  ].concat(module.exports.entry);

  module.exports.devtool = 'inline-source-map';

  module.exports.devServer = {
    hot: true,
    contentBase: targetPathAbs,
    publicPath: '/',
    historyApiFallback: true,
    port: 8081
  };

  module.exports.plugins.unshift(new Webpack.HotModuleReplacementPlugin());

}
else { // Production environment

  module.exports.plugins = [
    new CleanWebpackPlugin([targetPathRel]),
    new FaviconsWebpackPlugin({
      logo: './img/favicon.png',
      background: '#f7b617',
      title: 'Laboratoria LMS',
    }),
  ].concat(module.exports.plugins);

}
