import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { peerDependencies, dependencies } from './package.json';

const externalPackages = [
  ...Object.keys(dependencies || {}),
  ...Object.keys(peerDependencies || {}),
];

const regexesOfPackages = externalPackages.map(
  (packageName) => new RegExp(`^${packageName}(/.*)?`),
);

const commonOutputOptions = {
  preserveModules: true,
  preserveModulesRoot: 'src',
  entryFileNames: '[name].js',
  exports: 'named'
}

export default defineConfig({
  plugins: [react({
    babel: {
      configFile: true,
    },
  })],
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/index.js'),
      name: 'ReactStick'
    },
    rollupOptions: {
      external: regexesOfPackages,
      output: [
        {
          ...commonOutputOptions,
          format: 'commonjs',
          dir: path.resolve(__dirname, 'lib')
        },
        {
          ...commonOutputOptions,
          format: 'es',
          dir: path.resolve(__dirname, 'es')
        }
      ]
    }
  }
})