#!/bin/bash

git checkout $MASTER_BRANCH

npm install
npm run $BUILD_SCRIPT

mkdir tmp/$MASTER_BRANCH
cp -r $DIST_DIRECTORY/* tmp/$MASTER_BRANCH/

git reset --hard
