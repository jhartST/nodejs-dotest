#!/bin/bash
result=0
nodebin=`pwd`/node_modules/.bin
repourl=`npm view . repository.url | sed 's/^git:/https:/' | sed 's/\.git$//'`


# Detect ancient npm version
if [[ ! -f "$nodebin/coveralls" ]]; then
  nodebin=`pwd`/node_modules/dotest/node_modules/.bin
fi


# List commits since last release
thisTag=`git describe --tags --abbrev=0`
lastTag=`git describe --tags --abbrev=0 HEAD^`

if [ "$thisTag" == "$lastTag" ]; then
  thisTag="HEAD"
fi

echo "Commits since $lastTag to $thisTag"
echo "$repourl/compare/$lastTag...$thisTag"
echo
git log $lastTag..HEAD --oneline --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(blue)<%an>%Creset' --abbrev-commit
echo
echo


# ESLint
echo "Running ESLint..."
"$nodebin/eslint" *.js lib/ test/ || result=1
echo


# Run test script with coverage
"$nodebin/istanbul" cover test.js || result=1


# Submit coverage to Coveralls.io
if [ "$TRAVIS" == "true" ]; then
  echo
  echo "Sending coverage report to Coveralls..."
  cat `pwd`/coverage/lcov.info | "$nodebin/coveralls" || result=1
fi


# All done, return exit status
exit $result
