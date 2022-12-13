export default (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source);
  const queriesArr = []

  // check if has 'import query ...'
  
  // let importArrBuffer = []
  // root.find(j.MemberExpression, {object: {type: "Identifier", name: "query"}})
  //   .forEach(path => {
  //     const node = path.node
  //     if (importArrBuffer.includes(node.property.name)) {
  //       return;
  //     } else {
  //       importArrBuffer.push(node.property.name)
  //     }
  //
  //     // TODO: fix import path
  //     const importDec = j.importDeclaration(
  //       [j.importDefaultSpecifier(j.identifier(`${node.property.name}`))],
  //       j.stringLiteral(`redux/actions/queries/${node.property.name}`)
  //     )
  //     root.find(j.ImportDeclaration,{specifiers: [{local:{name: "query"}}]}).insertAfter(importDec)
  // })
  // root.find(j.ImportDeclaration,{specifiers: [{local:{name: "query"}}]}).remove()

  
	root.find(j.CallExpression, {
    callee: {
      object: {object: {type: "Identifier", name: "query"}}
    }
  }).forEach(path => {
    const newIdentifier = `${path.node.callee.property.name}Query`
    const newIdentifierLoc = `${path.node.callee.object.property.name.replace('Query', '')}:${newIdentifier}`
    const callExpr = j.callExpression(
      j.identifier(newIdentifier),
      path.node.arguments
    )
    const stateExpr = j.expressionStatement(callExpr);

    j(path).replaceWith(stateExpr)
    queriesArr.push(newIdentifierLoc)
  })
  console.log("QUERY_MARK")
  console.log(queriesArr.join("|"))
    
  return root.toSource();
}


