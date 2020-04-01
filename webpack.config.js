const webpack = require('webpack')
const path = require('path')

const HTMLWebpackPlugin = require('html-webpack-plugin')
const HTMLWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

const { NODE_ENV } = process.env

const inDev = NODE_ENV === 'development'

module.exports = {
  mode: inDev ? 'development' : 'production',
  devtool: inDev ? 'dev-tool-cheap-source-map' : 'source-map',
  entry: [path.resolve(__dirname, 'demo/src/index.js')],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new HTMLWebpackPlugin({
      alwaysWriteToDisk: true,
      minify: true,
      template: path.resolve(__dirname, 'demo/src/index.html'),
      filename: path.resolve(__dirname, 'build/index.html'),
    }),
    new HTMLWebpackHarddiskPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
}
