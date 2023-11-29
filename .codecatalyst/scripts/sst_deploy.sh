#!/usr/bin/env bash
echo "Deploying project"

source ~/.bashrc
npm install
npx sst deploy --stage prod