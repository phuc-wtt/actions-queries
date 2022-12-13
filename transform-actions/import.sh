#!/bin/bash

#DESC
# handle query import in /actions/


run(){
  echo "------- $1 -------"
  local file_path=$1
  local using_queries=$( echo $2 | sed 's|,|\n|g')
  local queries_loc=$( echo $3 | sed 's|,|\n|g')

  # clean up old query import
  #sed -i -E '/import.*\/queries/d'
  # append to top of file new imports
  while IFS= read -r query_with_loc
  do
    local query=$(echo "$query_with_loc" | grep -oP "(?<=:)\w+")
    local query_loc=$(echo "$query_with_loc" | grep -oP "^\w+")
    local match=$(echo "$queries_loc" | grep "$query" | grep "$query_loc")
echo "MATCH: $match"
    # check if math location
    if [ ! -z "$match" ];
    then
      # get query location
      local location=$(echo "$match" | grep -oP "^.*(?=:)" | sed 's|\./||g' | grep "$query_loc")


      local query_name=$(echo "$match" | grep -oP "(?<=:)\w+")
      # check if already imported
      local is_imported=$(grep "import.*$query_name" "$file_path")
      if [ -z "$is_imported" ];
      then
        echo "$query_name  -  $location"
        sed -i "1s|^|import { $query_name } from '${location}'\n|" "$file_path"
      fi



    else
      echo "Cant find match for $query"
    fi

  done <<< $using_queries
   

  echo "---------------------------------------------------"
}
run $1 $2 $3

