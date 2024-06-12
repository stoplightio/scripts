#!/bin/sh
set -e

Repository=$1

echo Testing repository $Repository

# clear out the scripts node_modules/yarn.lock to better represent real-world behavior of distributed npm package
sudo rm -R node_modules
sudo rm yarn.lock

cd ../

git clone git@github.com:stoplightio/$Repository.git

cd $Repository

tmp=$(mktemp)
jq '.resolutions."@stoplight/scripts" = "file:../project"' package.json > "$tmp"  
jq '.devDependencies."@stoplight/scripts" = "file:../project"' "$tmp" > package.json

yarn
yarn build
