#!/bin/bash

mkdir ${{ inputs.output-directory }}
mv tmp/* ${{ inputs.output-directory }}
