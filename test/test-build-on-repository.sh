Repository=$1

echo Testing repository $Repository

cd ../

git clone git@github.com:stoplightio/$Repository.git

cd $Repository

npx json -I -f package.json -e "this.resolutions={
\"@stoplight/scripts\": \"file:../project\",
}"

yarn
yarn build
