#!/usr/bin/env bash
set -ex -o pipefail

# These ones can be `npm link`ed for fast development
# Note that compiler-cli does not support TS 1.8 because tsc-wrapped uses 1.9 features
LINKABLE_PKGS=(
  $(pwd)/dist/packages-dist/{common,core,compiler,http,router,upgrade,platform-{browser,browser-dynamic,server}}
)

TMPDIR=${TMPDIR:-/tmp/angular-build/}
readonly TMP=$TMPDIR/typings-test.$(date +%s)
mkdir -p $TMP
cp -R -v tools/typings-test/* $TMP

# run in subshell to avoid polluting cwd
(
  cd $TMP
  # create package.json so that npm install doesn't pollute any parent node_modules's directory
  npm init --yes
  npm install ${LINKABLE_PKGS[*]} @types/jasmine rxjs@5.0 zone.js@0.7 typescript@2.0.2
  $(npm bin)/tsc --version
  $(npm bin)/tsc -p tsconfig.json
)
