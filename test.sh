#!/bin/bash
result=0

if [ "$TRAVIS_BRANCH" == "master" ] && [ "$CODECLIMATE_REPO_TOKEN" != "" ]; then
  istanbul cover test.js --print none --report lcovonly || result=1
  [ "$result" -eq "0" ] && codeclimate-test-reporter < ./coverage/lcov.info
else
  eslint *.js || result=1
  node test.js || result=1
fi

exit $result

