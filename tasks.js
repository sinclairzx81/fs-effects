const { folder, shell } = require('./tools')

/** Cleans this project. */
async function clean() {
  await folder('node_modules').delete().exec().catch(() => { /** cannot delete @types on windows */})
  await folder('public').delete().exec()
}

/** Builds this project. */
async function build() {
  await shell('tsc --project src/tsconfig.json --outDir public/bin --declaration').exec()
  await folder('public/bin').add('package.json').exec()
}

/** Builds the tools for this project. */
async function tools() {
  await shell('tsc-bundle ./src/tsconfig.json --outFile ./tools/index.js --exportAs commonjs').exec()
  await folder('tools').remove('index.js.map').exec()
}


/** Runs tests for this project. */
async function test() {
  await shell('tsc-bundle test/tsconfig.json --outFile public/test/index.js').exec()
  await shell('mocha public/test/index.js').exec()
}

/** Packs this project for NPM deployment. */
async function pack() {
  await build()

  await folder('public/pack')
    .delete()
    .create()
    .merge_from('public/bin')
    .add('package.json')
    .add('readme.md')
    .add('license')
    .exec()

  await shell('cd public/pack && npm pack').exec()
}

/** Command Line interface. */
async function cli (args, tasks) {
  const [_, __, task] = args
  await tasks[task]()
}
cli(process.argv, {
  clean,
  build,
  tools,
  test,
  pack
}).catch(console.log)