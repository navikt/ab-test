#!/bin/bash

git branch -r | grep --line-buffered $TEST_BRANCH_PREFIX | awk -v tbp=$TEST_BRANCH_PREFIX '{n=split($0,a, tbp); print a[n]}' | xargs -L1 >> ab-test-branches.tmp

if [ $(sed -n '=' ab-test-branches.tmp | wc -l) -gt 0 ]; then
  while read -r l;
    do git checkout "$TEST_BRANCH_PREFIX$l";
    npm install && npm run $BUILD_SCRIPT;
    mkdir tmp/"$l";
    cp -r $DIST_DIRECTORY/* tmp/"$l"/;
    git reset --hard;
  done < ab-test-branches.tmp
fi

git checkout $GITHUB_REF
