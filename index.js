const fs = require('fs')
const { cli, getQueries } = require("./helper.js")
const queriesPath = "./redux/actions/queries/"
const actionsPath = "./redux/actions/"


// const queries_files = cli(` find ${queriesPath} -maxdepth 2 -name "*.js" | sed '/index/d' `)
// queries_files.forEach(filePath => {
//   cli(`jscodeshift -t codemod/transform-queries ${filePath} `)
// })
//
//
// const actions_files = cli(` find ${actionsPath} -maxdepth 1 -name "*.js" | sed '/index/d' `)
const queries_loc = cli(`codemod/transform-actions/import-prep.sh ${queriesPath}`)
// actions_files.forEach(filePath => {
//   const usingQueriesRaw = cli(`jscodeshift -t codemod/transform-actions ${filePath} `)
//   const usingQueries = getQueries(usingQueriesRaw, "QUERY_MARK", "|")
//   if (usingQueries) {
//     cli(`codemod/transform-actions/import.sh ${filePath} ${usingQueries} ${queries_loc}`)
//   }
// })
//
// cli(`codemod/transform-actions/import-capitals.sh`)

console.log(cli(`codemod/transform-actions/import-direct.sh ${queries_loc}`))

console.log("direct import -> property")

console.log("./redux/actions/postActions.js:import postQuery, { POST_STATUSES } from './queries/frontEnd/post'")
