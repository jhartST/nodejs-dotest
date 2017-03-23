#!/bin/bash
result=0
nodebin="$(pwd)/node_modules/.bin"
eslintBin=$(command -v eslint)
istanbulBin=$(command -v istanbul)
coverallsBin=$(command -v coveralls)

export GIT_REPO_SLUG="$TRAVIS_REPO_SLUG"

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
if [[ -x "$eslintBin" ]]; then
  echo "Running ESLint..."
  "$eslintBin" *.js lib/ test/ || result=1
  echo
else
  result=1
  echo -e "\033[31mERROR:\033[0m ESLint is not installed"
  echo "Run 'npm i eslint --save-dev'"
  echo
fi

# Run test script with coverage
if [[ -x "$istanbulBin" ]]; then
  "$istanbulBin" cover test.js || result=1
else
  result=1
  echo -e "\033[31mERROR:\033[0m Istanbul is not installed"
  echo "Run 'npm i istanbull --save-dev'"
  echo
fi

# Submit coverage to Coveralls.io
if [[ "$TRAVIS" == "true" ]]; then
  if [[ -x "$coverallsBin" ]]; then
    echo
    echo "Sending coverage report to Coveralls..."
    "$coverallsBin" < "$libpath/coverage/lcov.info" || result=1
  else
    result=1
    echo -e "\033[31mERROR:\033[0m Coveralls is not installed"
    echo "Run 'npm i coveralls --save-dev'"
    echo
  fi
fi


# All done, return exit status
exit $result
