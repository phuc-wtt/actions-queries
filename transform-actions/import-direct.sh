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
        sed -E "s|:.*||" |
        uniq 
    )
    # rm old import first
    sed -i -E "/import.*queries.*${import_name}/d" "$file_path"

    while IFS= read -r method
    do
      method=$(echo "$method" | grep -oP '(?<=\.).*')
      method_suffixed=$(echo "${method}_QUERY")

      # suffix prop_name
      sed -i -E "s|${import_name}Query\.${method}|${method_suffixed}|g" "$file_path"


      # insert import
      # check if method already imported
      local is_imported=$(grep "import.*${method_suffixed}" "$file_path")
      if [ -z "$is_imported" ];
      then
        # check if already has import
        local existed=$(grep -noP "import.\{.*\}*${import_path}" $file_path)
        if [ ! -z "$existed" ];
        then
          local line_num=$(echo "$existed" | grep -oP '^\d+')
          sed -i -E "${line_num}s|(\{.*)(\s\})|\1, ${method_suffixed}\2|" "$file_path"
        else
          sed -i "1s|^|import { ${method_suffixed} } from '${import_path}'\n|g" "$file_path"
        fi
      fi

    done <<< "$methods"

  done <<< "$direct_imports"
  

}
run $1

