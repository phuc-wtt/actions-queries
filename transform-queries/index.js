export default (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source)

  const imports = root.find(j.ImportDeclaration)

  const n = imports.length

  // extract named-export from export-default-obj
  root.find(j.ExportDefaultDeclaration).find(j.Property, {value: {type: "FunctionExpression"}})
    .forEach(path => {
      const node = path.node
      const funcDec = j.functionDeclaration(
        j.identifier(`${node.key.name}Query`),
        node.value.params,
        j.blockStatement(node.value.body.body)
      )
      const namedExport = j.exportNamedDeclaration(funcDec)

      if (n) {
        j(imports.at(n-1).get()).insertAfter(namedExport)
      } else {
        root.get().node.program.body.unshift(namedExport);
      }
      j(path).remove()
    })

  // export const
  root.find(j.VariableDeclaration, { kind: "const" })
    .forEach(path => {
      const node = path.node
      const body = j(path).find(j.TaggedTemplateExpression).nodes()[0]
      if (typeof body === 'undefined') return
      const varDec = j.variableDeclaration(
        "const", [
          j.variableDeclarator(
            j.identifier(`${node.declarations[0].id.name}_QUERY`),
            body
          )
        ]
      )
      if (path.parentPath.name !== "body") {
        j(path).replaceWith(varDec)
        return
      }
      const namedExport = j.exportNamedDeclaration(varDec)
      j(path).replaceWith(namedExport)
  })

  root.find(j.ExportDefaultDeclaration).remove()

  return root.toSource()
}
