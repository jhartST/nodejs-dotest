#!/bin/bash
if [ "$TRAVIS_BRANCH" == "master" ]; then
  istanbul cover test.js --print none --report lcovonly
  codeclimate-test-runner < ./coverage/lcov.info
else
  node test.js
fi

