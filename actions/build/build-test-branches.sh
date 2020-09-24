#!/bin/bash

git branch -r | grep --line-buffered ${{ inputs.test-branch-prefix }} | awk '{n=split($0,a,"${{ inputs.test-branch-prefix  }}"); print a[n]}' | xargs -L1 >> ab-test-branches.tmp

while read l;
  do git checkout "${{ inputs.test-branch-prefix }}$l";
  npm install && npm run ${{ inputs.build-script }};
  mkdir tmp/"$l";
  cp -r ${{ inputs.dist-directory }}/* tmp/"$l"/;
  git reset --hard;
done < ab-test-branches.tmp

git checkout $GITHUB_REF
