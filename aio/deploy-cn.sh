#!/usr/bin/env bash

set -x
set -e

commitSha=$(git rev-parse --short HEAD)
commitMessage=$(git log --oneline -n 1)

cd ./release/angular.cn

git add .
git reset --hard

git pull -r

chmod -R +w .

cp -r ../../../dist/bin/aio/build/* .

nt mark './generated/**/*.json'

ossutil cp -r . oss://angular-15 -e oss-cn-hangzhou.aliyuncs.com -u

cp index.html 404.html

git add .
git commit -am "${commitMessage}"

git push

cd -
