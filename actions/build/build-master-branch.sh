#!/bin/bash

git checkout ${{ inputs.master-branch }}

npm install
npm run ${{ inputs.build-script }}

mkdir tmp/${{ inputs.master-branch }}
cp -r ${{ inputs.dist-directory }}/* tmp/${{ inputs.master-branch }}/

git reset --hard
