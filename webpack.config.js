const webpack = require('webpack')
const path = require('path')

const HTMLWebpackPlugin = require('html-webpack-plugin')
const HTMLWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

const { NODE_ENV } = process.env

const inDev = NODE_ENV === 'development'

module.exports = {
  mode: inDev ? 'development' : 'production',
  devtool: 'source-map',
  entry: [path.resolve(__dirname, 'demo/index.tsx')],
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
      template: path.resolve(__dirname, 'demo/index.html'),
      filename: path.resolve(__dirname, 'build/index.html'),
    }),
    new HTMLWebpackHarddiskPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        include: /demo/,
        loader: 'ts-loader',
      },
    ],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
}
