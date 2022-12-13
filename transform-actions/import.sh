#!/bin/bash

#DESC
# handle query import in /actions/


run(){
  local file_path=$1
  local using_queries=$( echo $2 | sed 's|,|\n|g')
  local queries_loc=$( echo $3 | sed 's|,|\n|g')
  # clean up old query import
  sed -i -E '/import.*\/queries/d' "$file_path"
  # append to top of file new imports
  while IFS= read -r query_with_loc
  do
    local query=$(echo "$query_with_loc" | grep -oP "(?<=:)\w+")
    local query_loc=$(echo "$query_with_loc" | grep -oP "^\w+")
    local match=$(echo "$queries_loc" | grep "$query" | grep "$query_loc")
    # check if math location
    if [ ! -z "$match" ];
    then
      # get query location
      local location=$(echo "$match" | grep -oP "^.*(?=:)" | sed 's|\./||g' | grep "$query_loc")

      local query_name=$(echo "$match" | grep -oP "(?<=:)\w+")
      # check if method already imported
      local is_imported=$(grep "import.*$query_name" "$file_path")
      if [ -z "$is_imported" ];
      then
        # check if file import existed
        is_existed=$( grep -n "import.*'${location}'" "$file_path" )
        if [ ! -z "$is_existed" ];
        then
          # get line_num
          line_num=$( echo "$is_existed" | grep -oP '^\d+' )
          # append method into {  }
          sed -E -i "${line_num}s|(\{.*)(\s\})|\1, ${query_name}\2|" "$file_path"
        else
          # or import it
          sed -i "1s|^|import { $query_name } from '${location}'\n|" "$file_path"
        fi
      fi

    else
      echo "Cant find match for $query"
    fi

  done <<< $using_queries
}
run $1 $2 $3

