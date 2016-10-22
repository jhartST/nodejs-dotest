#!/bin/bash
result=0
nodebin=`pwd`/node_modules/.bin


# Detect ancient npm version
if [ ! -f $nodebin/coveralls ]; then
  nodebin=`pwd`/node_modules/dotest/node_modules/.bin
fi


# List commits since last release
thisTag=`git describe --tags --abbrev=0`
lastTag=`git describe --tags --abbrev=0 HEAD^`

if [ "$thisTag" == "$lastTag" ]; then
  thisTag="HEAD"
fi

echo "Commits since $lastTag to $thisTag"
echo
git log $lastTag..HEAD --oneline --pretty=format:'%C(green)%h%C(reset)  %<(12)%C(blue)%cr%C(reset)% C(red)%D%C(reset)% C(cyan)%s%C(reset)' --abbrev-commit
echo
echo


# ESLint
echo "Running ESLint..."
$nodebin/eslint *.js lib/ test/ || result=1
echo


# Run test script with coverage
$nodebin/istanbul cover test.js || result=1


# Submit coverage to Coveralls.io
if [ "$TRAVIS" == "true" ]; then
  echo
  echo "Sending coverage report to Coveralls..."
  cat `pwd`/coverage/lcov.info | $nodebin/coveralls || result=1
fi


# All done, return exit status
exit $result
