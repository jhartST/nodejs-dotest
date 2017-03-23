#!/bin/bash
result=0
libpath="$(pwd)"
nodebin="$libpath/node_modules/.bin"
export GIT_REPO_SLUG="$TRAVIS_REPO_SLUG"

# Detect ancient npm version
if [[ ! -f "$nodebin/coveralls" ]]; then
  nodebin="$libpath/node_modules/dotest/node_modules/.bin"
fi

# Find reposlug
if [ "$reposlug" == "" ]; then
  export GIT_REPO_SLUG=$(git ls-remote --get-url | sed 's/.*[\/|@]github.com[:\/]\(.*\).git/\1/')
fi

repourl="https://github.com/$GIT_REPO_SLUG"

# List commits since last release
thisTag=$(git describe --tags --abbrev=0)
lastTag=$(git describe --tags --abbrev=0 HEAD^)

if [ "$thisTag" == "$lastTag" ]; then
  thisTag="HEAD"
fi

echo "Commits since $lastTag to $thisTag"
echo
echo "$repourl/compare/$lastTag...$thisTag"
echo
git log $lastTag..HEAD --oneline --pretty=format:'%C(green)%h%Creset -%C(red)%d%Creset %C(yellow)%s%Creset %C(blue)(%cr)' --abbrev-commit
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
  "$nodebin/coveralls" < "$libpath/coverage/lcov.info" || result=1
fi


# All done, return exit status
exit $result
