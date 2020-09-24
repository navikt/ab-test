#!/bin/bash

rm -rf ${{ inputs.output-directory }} || true && mkdir ${{ inputs.output-directory }}

mv tmp/* ${{ inputs.output-directory }}
