'use strict';


const Path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


const extractTextWebpackPlugin = new ExtractTextWebpackPlugin({
  filename: 'main.css'
});

const isProduction = process.env.NODE_ENV === 'production';
const targetPathRel = 'dist';
const targetPathAbs = Path.resolve(__dirname, targetPathRel);


module.exports = env => {
  const config = {
    context: Path.resolve(__dirname, 'src'),
    entry: ['./index.jsx'],
    output: {
      filename: 'bundle.js',
      path: targetPathAbs,
      publicPath: '/'
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets:[ 'es2015', 'react', 'stage-2' ]
            }
          }]
        },
        {
          test: /\.css$/,
          use: extractTextWebpackPlugin.extract({
            use: ['css-loader']
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


  if (env && env.backend === 'deko-produccion') { // backend de producción
    config.plugins.push(new Webpack.DefinePlugin({
      'process.env.FIREBASE_PROJECT': `"${env.backend}"`,
      'process.env.FIREBASE_API_KEY': `"xyz"`,
      'process.env.FIREBASE_MESSAGING_SENDER_ID': `"123"`,
    }));
  }
  else if (env && env.backend === 'deko-staging') { // backend de staging
    config.plugins.push(new Webpack.DefinePlugin({
      'process.env.FIREBASE_PROJECT': `"${env.backend}"`,
      'process.env.FIREBASE_API_KEY': `"qwe"`,
      'process.env.FIREBASE_MESSAGING_SENDER_ID': `"456"`,
    }));
  }
  else {
    [
      'FIREBASE_PROJECT',
      'FIREBASE_API_KEY',
      'FIREBASE_MESSAGING_SENDER_ID'
    ].forEach(item => {
      if (!process.env.hasOwnProperty(item)) {
        throw new Error(`Variable de entorno ${item} no definida`);
      }
    });
    config.plugins.push(new Webpack.DefinePlugin({
      'process.env.FIREBASE_PROJECT': `"${process.env.FIREBASE_PROJECT}"`,
      'process.env.FIREBASE_API_KEY': `"${process.env.FIREBASE_API_KEY}"`,
      'process.env.FIREBASE_MESSAGING_SENDER_ID': `"${process.env.FIREBASE_MESSAGING_SENDER_ID}"`,
    }));
  }

  console.log(`Backend: ${(env || {}).backend || process.env.FIREBASE_PROJECT}`);


  if (isProduction) { // Dist files

    config.mode = 'production';
    config.plugins = [
      new Webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }),
      new CleanWebpackPlugin([targetPathRel]),
      new UglifyJSPlugin(),
      new FaviconsWebpackPlugin({
        logo: './img/ico.jpg',
        background: '#FF5D51',
        title: 'Dekoclick',
      }),
    ].concat(config.plugins);

  }
  else { // Hot loader

    config.mode = 'development';
    config.entry = [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8083',
      'webpack/hot/only-dev-server'
    ].concat(config.entry);

    config.devtool = 'inline-source-map';

    config.devServer = {
      hot: true,
      contentBase: targetPathAbs,
      publicPath: '/',
      historyApiFallback: true,
      port: 8083
    };

    config.plugins.unshift(new Webpack.HotModuleReplacementPlugin());

  };

  return config;
};
