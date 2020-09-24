#!/bin/bash

git branch -r | grep --line-buffered $TEST_BRANCH_PREFIX | awk '{n=split($0,a,"$TEST_BRANCH_PREFIX"); print a[n]}' | xargs -L1 >> ab-test-branches.tmp

while read l;
  do git checkout "$TEST_BRANCH_PREFIX$l";
  npm install && npm run $BUILD_SCRIPT;
  mkdir tmp/"$l";
  cp -r $DIST_DIRECTORY/* tmp/"$l"/;
  git reset --hard;
done < ab-test-branches.tmp

git checkout $GITHUB_REF
