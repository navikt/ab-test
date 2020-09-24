#!/bin/bash

git branch -r | grep --line-buffered ${{ inputs.test-branch-prefix }} | awk '{n=split($0,a,"${{ inputs.test-branch-prefix  }}"); print "${{ inputs.test-branch-prefix }}"a[n]}' | xargs -L1 >> ab-test-branches.tmp

while read l;
  do git checkout "$l";
  npm install && npm run ${{ inputs.build-script }};
  mkdir tmp/"$l"
  cp ${{ inputs.dist-directory }}/* tmp/"$l"/
  git reset --hard
done < ab-test-branches.tmp

git checkout $GITHUB_REF
