const path = require('path')

const HTMLWebpackPlugin = require('html-webpack-plugin')
const HTMLWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')

const { NODE_ENV } = process.env

const inDev = NODE_ENV === 'development'

module.exports = {
  mode: inDev ? 'development' : 'production',
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src/index.tsx'),
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: '[fullhash].js',
    chunkFilename: '[fullhash].js',
    clean: true,
  },
  plugins: [
    new HTMLWebpackPlugin({
      alwaysWriteToDisk: true,
      minify: true,
      template: path.resolve(__dirname, 'src/index.html'),
      filename: path.resolve(__dirname, '../build/index.html'),
    }),
    new HTMLWebpackHarddiskPlugin(),
  ],
  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['.js', '.tsx', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
}
