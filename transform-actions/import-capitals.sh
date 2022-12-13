#!/bin/bash

run(){
  local capital_imports=$(
    grep -rP 'import.*[A-Z]+(_[A-Z]+)+.*/queries' ./ \
      --exclude-dir=node_modules\
      --exclude-dir=.next\
      --exclude-dir=.git\
      --exclude-dir=out\
      --exclude-dir=codemod
  )

  while IFS= read -r line
  do

    local file_path=$(echo "$line" | grep -oP ".*(?=:)")
    local prop_name=$(echo "$line" | grep -oP "[A-Z]+(_[A-Z]+)+")
    sed -i "s|${prop_name}|${prop_name}_QUERY|g" "$file_path"

  done <<< "$capital_imports"
  
  

}
run
