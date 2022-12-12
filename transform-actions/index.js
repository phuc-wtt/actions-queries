export default (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source);

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

  
	const r = root.find(j.CallExpression, {
    callee: {
      object: {object: {type: "Identifier", name: "query"}}
    }
  }).forEach(path => {
    const node = path.node
    const callExpr = j.callExpression(
      j.identifier(`${node.callee.property.name}Query`),
      node.arguments
    )
    const stateExpr = j.expressionStatement(callExpr);

    j(path).replaceWith(stateExpr)
  })
    
  return root.toSource();
}


