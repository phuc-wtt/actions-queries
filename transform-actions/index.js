export default (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source);
  const queriesArr = []
  
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


