#!/bin/sh
if [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_REPO_SLUG" == "fvdm/nodejs-dotest" ]; then
  istanbul cover test.js --print none --export lcovonly
  codeclimate-test-runner < ./coverage/lcov.info
else
  node test.js
fi

