#! /bin/bash
echo "building....."
yarn install
npm run build
git add *;
git commit -m "commit build $version"
echo "built successfully"

npm version patch
version=$(node -p -e "require('./package.json').version")
name=$(node -p -e "require('./package.json').name")
cp ./package.json ./dist/package.json
git add *;
git commit -m "commit release $version"
git push
cd dist
if [ "$version" != "" ]; then
    echo "created a new tag, $version"
    git push --tags
    echo "node module - releasing....."
    npm publish
    echo "node module - released successfully $name:$version"
fi