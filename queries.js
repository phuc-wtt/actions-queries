const fs = require('fs')
const { execSync } = require("child_process")

const queriesPath = "./redux/actions/queries/"
const actionsPath = "./redux/actions/"

const cli = (command) => {
  // may need err handling
  const result = execSync(command).toString().split('\n')
  result.pop()
  return result
}

const queries_files = cli(` find ${queriesPath} -maxdepth 2 -name "*.js" | sed '/index/d' `)
queries_files.forEach(filePath => {
  cli(`jscodeshift -t transform-queries.js ${filePath} `)
})

const actions_files = cli(` find ${actionsPath} -maxdepth 1 -name "*.js" | sed '/index/d' `)
actions_files.forEach(filePath => {
  cli(`jscodeshift -t transform-page.js ${filePath} `)
})


// TODO: add suffix:
//  + func: 'Query'
//  + var : '_QUERY'
// TODO: direct query_file import
// TODO: fix import path
