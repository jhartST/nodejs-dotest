#!/bin/bash
result=0

thisTag=`git describe --tags --abbrev=0`
lastTag=`git describe --tags --abbrev=0 HEAD^`

if [ "$thisTag" == "$lastTag" ]; then
  thisTag="HEAD"
fi

echo "Commits since $lastTag to $thisTag"
echo
git log $lastTag..HEAD --oneline --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
echo
echo

echo "Running ESLint..."
./node_modules/.bin/eslint *.js lib/ test/ || result=1
echo

./node_modules/.bin/istanbul cover test.js || result=1

if [ "$TRAVIS" == "true" ]; then
  echo
  echo "Sending coverage report to Coveralls..."
  cat ./coverage/lcov.info | ./node_modules/.bin/coveralls || result=1
fi

exit $result
