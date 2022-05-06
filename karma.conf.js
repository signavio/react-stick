module.exports = function (config) {
  config.set({
    browsers: ['ChromeHeadless'],
    files: [
      "+(src|test?(s))/**/*+(.spec|.test).js"
    ],
    frameworks: ['mocha', 'webpack'],
    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-sourcemap-loader',
    ],
    preprocessors: {
      "+(src|test?(s))/**/*+(.spec|.test).js": ['webpack', 'sourcemap'],
    },
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            exclude: /node_modules/,
            test: /\.js$/,
            loader: 'babel-loader'
          }
        ]
      },
      "devtool": "cheap-module-inline-source-map",
    },
    singleRun: true,
    reporters: ['mocha', 'coverage'],
    mochaReporter: { 'showDiff': true },
    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
      reporters: [
        { type: 'html', 'subdir': 'html' },
        { type: 'lcovonly', 'subdir': '.' },
        { type: 'text-summary' }
      ]
    },
  })
}