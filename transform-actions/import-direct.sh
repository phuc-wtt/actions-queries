#!/bin/bash

run(){
  local queries_loc=$(echo $1 | sed 's|,|\n|g')
  local direct_imports=$(
    grep -rP 'import.*\w+Query.*/queries/' ./ \
      --exclude-dir=node_modules\
      --exclude-dir=.next\
      --exclude-dir=.git\
      --exclude-dir=out\
      --exclude-dir=codemod |
      sed '/{/d' | sed '/\/\//d'
  )
  while IFS= read -r line
  do
    local file_path=$(echo "$line" | grep -oP ".*(?=:)")
    local import_name=$(echo "$line" | grep -oP "(?<=import\s)\w*" | sed 's|Query||')
    local methods=$(grep -oP "${import_name}Query\.[A-Z]+(_[A-Z]+)+" "$file_path")
    local import_path=$(
      echo "$queries_loc" |
        grep "$import_name" |
        sed -E "s|\./||" |
        sed -E "s|:.*||"
    )
    # insert import
    # suffix prop_name

  done <<< "$direct_imports"
  
  

}
run $1

