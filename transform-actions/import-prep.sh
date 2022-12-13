#!/bin/bash

run(){
  local queries_folder=$1
  grep -Por "(?<=export)\s+\w+\s+(\w+)" "$queries_folder" |
    sed -E 's|:\s+\w+\s+|:|g' | sed 's|.js||g'
}
run $1
