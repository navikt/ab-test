#!/bin/bash

rm -rf $OUTPUT_DIRECTORY || true

mkdir $OUTPUT_DIRECTORY

mv tmp/* $OUTPUT_DIRECTORY
