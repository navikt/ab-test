#!/bin/bash

git branch -r | grep --line-buffered $TEST_BRANCH_PREFIX | awk -v tbp=$TEST_BRANCH_PREFIX '{n=split($0,a, tbp); print a[n]}' | xargs -L1 >> ab-test-branches.tmp

while read -r l; do
  if [ ! -z $l ]; then
    git checkout "$TEST_BRANCH_PREFIX$l";
    npm install && npm run $BUILD_SCRIPT;
    mkdir tmp/"$l";
    cp -r $DIST_DIRECTORY/* tmp/"$l"/;
    git reset --hard;
  fi
done < ab-test-branches.tmp

git checkout $GITHUB_REF
