module.exports = {
  type: 'react-component',
  babel: {
    env: {
      targets: {
        browsers: ['chrome >= 50', 'firefox >= 52', 'safari >= 10', 'ie >= 11'],
      },
    },
    presets: ['@babel/preset-flow', '@babel/preset-typescript'],
  },
  npm: {
    esModules: true,
    umd: false,
  },
  karma: {
    frameworks: ['karma-typescript'],
    plugins: ['karma-typescript'],
    extra: {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      preprocessors: {
        '**/*.ts': 'karma-typescript',
        '**/*.tsx': 'karma-typescript',
      },

      karmaTypescriptConfig: {
        compilerOptions: {
          esModuleInterop: true,
          target: 'es5',
          module: 'es2015',
          jsx: 'react',
          allowJs: true,
          allowSyntheticDefaultImports: true,
        },
      },
    },
    browsers: ['ChromeHeadless'],
  },
}
