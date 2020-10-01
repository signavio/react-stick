module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: false,
  },
  webpack: {
    extra: {
      resolve: {
        extensions: ['.js', '.ts', '.tsx'],
      },
      module: {
        rules: [
          {
            test: /\.ts(x)?$/,
            exclude: /node_modules/,
            loader: 'ts-loader',
          },
        ],
      },
    },
  },
  karma: {
    frameworks: ['mocha', 'karma-typescript'],
    plugins: ['karma-typescript'],
    testFiles: 'tests/**/*.tsx',
    extra: {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      preprocessors: {
        '**/*.ts': ['karma-typescript'],
        '**/*.tsx': ['karma-typescript'],
      },

      karmaTypescriptConfig: {
        compilerOptions: {
          esModuleInterop: true,
          sourceMap: true,
        },
      },
    },
    browsers: ['ChromeHeadless'],
  },
}
