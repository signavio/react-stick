const ghpages = require('gh-pages')
const path = require('path')
const fs = require('fs')

const branchName = process.argv[2]
const dir = path.resolve(__dirname, '..', 'demo', 'dist')

if (!fs.existsSync(path)) {
  throw new Error(`${dir} does not exist. Run \`yarn build\` first.`)
}

console.log(
  `Publishing demo/dist to https://signavio.github.io/react-stick/${branchName}`
)

// ghpages.publish('docs', err => {
//   console.error(err)
// })
