Repository=$1

echo Testing repository $Repository

mkdir temp
cd temp

git clone git@github.com:stoplightio/$Repository.git

cd $Repository

npx json -I -f package.json -e "this.resolutions={
\"@stoplight/scripts\": \"file:../..\",
}"

yarn
yarn build
