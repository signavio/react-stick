module.exports = {
  type: 'react-component',
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
          module: 'commonjs',
          jsx: 'react',
          allowJs: true,
          allowSyntheticDefaultImports: true,
          moduleResolution: 'node',
          rootDirs: ['src', 'test'],
        },
      },
    },
    browsers: ['ChromeHeadless'],
  },
}
