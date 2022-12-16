#!/usr/bin/env bash

set -x
set -e

commitSha=$(git rev-parse --short HEAD)
commitMessage=$(git log --oneline -n 1)

#npm i -g @awesome-fe/translate@1.1.21

cd $(dirname $0)

yarn build

cd ./release/latest.angular.live

git pull -r

chmod -R +w .

cp -r ../../../dist/bin/aio/build/* .

nt mark './generated/**/*.json'

cp index.html 404.html

git add .
git commit -am "${commitMessage}"

git push

cd -
