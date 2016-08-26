#!/bin/bash
result=0

echo "Running ESLint..."
./node_modules/.bin/eslint . || result=1
echo

./node_modules/.bin/istanbul cover test.js || result=1

if [ "$TRAVIS" == "true" ]; then
  echo
  echo "Sending coverage report to Coveralls..."
  cat ./coverage/lcov.info | ./node_modules/.bin/coveralls || result=1
fi

exit $result
