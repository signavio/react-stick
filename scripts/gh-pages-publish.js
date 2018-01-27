const ghpages = require('gh-pages')
const path = require('path')
const fs = require('fs')
const ghBot = require('circle-github-bot').create()

const branchName = process.argv[2]
const dir = path.resolve(__dirname, '..', 'demo', 'dist')
const url = `https://signavio.github.io/react-stick/${branchName}`

if (!fs.existsSync(dir)) {
  throw new Error(`${dir} does not exist. Run \`yarn build\` first.`)
}

console.log(`Publishing demo/dist to ${url}...`)

ghpages.publish(
  dir,
  {
    dest: branchName,
    message: `Published demo build for \`${branchName}\` branch.`,
  },
  err => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    ghBot.comment(`
Demo page for commit <code>${
      ghBot.env.commitMessage
    }</code> has been published at:<br />
<strong>https://signavio.github.io/react-stick/${branchName}</strong>
`)

    console.log(
      '\x1b[32m%s\x1b[0m',
      `✓ Demo page successfully published at ${url}`
    )
  }
)
