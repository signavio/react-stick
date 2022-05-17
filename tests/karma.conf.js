const webpack = require('webpack')

module.exports = function (config) {
  config.set({
    browsers: ['ChromeHeadless'],
    files: ['**/*.test.+(ts|tsx)'],

    frameworks: ['mocha', 'webpack'],
    preprocessors: {
      '**/*.test.+(ts|tsx)': ['webpack', 'sourcemap'],
    },
    webpack: {
      mode: 'development',
      plugins: [
        new webpack.DefinePlugin({
          'process.env': JSON.stringify(process.env),
        }),
      ],
      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: {
              loader: 'babel-loader',
              options: {
                plugins: ['istanbul'],
                presets: [
                  '@babel/react',
                  '@babel/typescript',
                  [
                    '@babel/env',
                    {
                      modules: false,
                      useBuiltIns: 'entry',
                      corejs: 3,
                    },
                  ],
                ],
              },
            },
            exclude: /node_modules/,
          },
          {
            test: /\.tsx?$/,
            use: [
              {
                loader: 'ts-loader',
                options: {
                  configFile: './tsconfig.json',
                },
              },
            ],
            exclude: /node_modules/,
          },
        ],
      },
      devtool: 'inline-cheap-source-map',
    },
    singleRun: true,
    reporters: ['mocha', 'coverage'],
    mochaReporter: { showDiff: true },
    coverageReporter: {
      type: 'html',
      dir: '../coverage/',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: '.' },
        { type: 'text-summary' },
      ],
    },
  })
}
