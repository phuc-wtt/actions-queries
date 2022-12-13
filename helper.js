const { execSync } = require("child_process")

exports.cli = (command) => {
  // may need err handling
  const result = execSync(command).toString().split('\n')
  result.pop()
  return result
}

exports.getQueries = (input, mark, separator) => {
  let output = input[input.indexOf(mark) + 1]
  output = output.split(separator)
  if (output[0] === '') return null
  return output
}
