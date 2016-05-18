/*
Name:           doTest - Unit tests runner
Description:    Yet another unit test runner for Node.js
Author:         Franklin van de Meent (https://frankl.in)
Source & docs:  https://github.com/fvdm/nodejs-dotest
Feedback:       https://github.com/fvdm/nodejs-dotest/issues
License:        Unlicense (public domain, see LICENSE file)
*/

var path = require ('path');
var util = require ('util');
var dir = path.parse (process.mainModule.filename) .dir.replace (/\/lib$/, '');
var pkg = require (path.join (dir, 'package.json'));
var lib = require (path.join (__dirname, 'package.json'));

var testFunc;
var queue = [];
var next = -1;
var unitTests = {};
var onExitCallback;
var counters = {
  fail: 0,
  warn: 0,
  startTime: Date.now ()
};

var config = {
  wait: 0,
  noConsole: false
};


/**
 * ANSI colorize a string
 *
 * @param color {String} - The color to add
 * @param str {String} - The string to alter
 * @returns {String}
 */

function colorStr (color, str) {
  var colors = {
    red: '\u001b[31m',
    green: '\u001b[32m',
    yellow: '\u001b[33m',
    blue: '\u001b[34m',
    magenta: '\u001b[35m',
    cyan: '\u001b[36m',
    gray: '\u001b[37m',
    bold: '\u001b[1m',
    plain: '\u001b[0m'
  };

  return colors [color] + str + colors.plain;
}


/**
 * console.log with style
 *
 * @param [type] {String=plain} - Formatting style
 * @param str {String} - The string to alter
 * @returns {void}
 */

function log (type, str) {
  var types = {
    good: ['green', 'good'],
    info: ['cyan', 'info']
  };

  if (!str) {
    str = type;
    type = 'plain';
  }

  switch (type) {
    case 'note':
      console.log (colorStr ('bold', str));
      break;
    case 'fail':
      counters.fail++;
      console.log (colorStr ('red', 'FAIL') + '    ' + str);
      break;
    case 'warn':
      counters.warn++;
      console.log (colorStr ('yellow', 'warn') + '    ' + str);
      break;
    case 'error':
      counters.fail++;
      console.log (colorStr ('red', 'ERROR  ') + str.message + '\n');
      console.dir (str, {
        depth: null,
        colors: true
      });

      // node v6 includes stack trace in the Error
      if (process.versions.node < '6.0.0') {
        console.log ();
        console.log (str.stack);
        console.log ();
      }
      break;
    case 'object':
      console.dir (str, {
        depth: null,
        colors: true
      });
      break;
    case 'plain': console.log (str); break;
    default:
      console.log (colorStr (types[type][0], types[type][1]) + '    ' + str);
      break;
  }
}


/**
 * Run next test in queue
 *
 * @param index {number} - queue[] index
 * @returns {void}
 */

function doNext (index) {
  console.log (
    '\n\n'
    + colorStr ('cyan', (index + 1) + '/' + queue.length)
    + '  '
    + colorStr ('bold', queue [index] .label)
  );

  console.log ();

  queue [index] .runner (testFunc);
}


/**
 * Run callback, optional wait time, run next test in queue
 *
 * @callback callback
 * @param [callback] {function} - Run callback before next test
 * @returns {void}
 */

function done (callback) {
  if (callback instanceof Function) {
    callback (next);
  }

  next++;

  if (queue [next]) {
    if (next && config.wait) {
      setTimeout (
        function () {
          doNext (next);
        },
        config.wait
      );

      return;
    }

    doNext (next);
  }
}


/**
 * Get any var type
 * The order of if's is important
 *
 * @param input {mixed} - The value to check
 * @returns {string} - Lowercase type
 */

function getType (input) {
  if (input instanceof Date) {
    return 'date';
  }

  if (input instanceof RegExp) {
    return 'regexp';
  }

  if (input instanceof Error) {
    return 'error';
  }

  if (input instanceof Function) {
    return 'function';
  }

  if (input instanceof Array) {
    return 'array';
  }

  if (input instanceof Object) {
    return 'object';
  }

  if (input === null) {
    return 'null';
  }

  return (typeof input);
}


/**
 * Get formatted var type for console
 *
 * @param str {string} - The var to convert
 * @param [noType = false] {boolean} - Don't append ' (type)'
 * @returns {string} - i.e. hello (string)
 */

function typeStr (str, noType) {
  var type = getType (str);
  var doType = !noType ? ' (' + type + ')' : '';
  var typeMatch = type.match (/(string|boolean|number|date|regexp|array)/);
  var length = '';

  // length
  switch (type) {
    case 'string':
    case 'array':
      length = ' (' + str.length + ')';
      break;
    case 'object':
    case 'error':
      length = ' (' + Object.keys (str).length + ')';
      break;
    default:
      length = '';
      break;
  }

  // parse special
  if (type.match (/(object|array)/)) {
    str = util.inspect (str, {
      depth: null,
      colors: true
    });
    str = str.replace ('\n', ' ');

    if (str.length <= 50) {
      str = colorStr ('magenta', str[0])
        + str.slice (1, -1)
        + colorStr ('magenta', str.slice (-1))
        + doType;

      return str;
    }
  }

  // parse function
  if (type === 'function') {
    str = util.inspect (str, {
      colors: true
    });
    str += '\u001b[0m';

    return str;
  }

  // parse rest
  str = String (str);

  if (typeMatch && str.length && str.length <= 50) {
    return colorStr ('magenta', str) + doType;
  }

  return colorStr ('magenta', type) + length;
}


/**
 * Write test result to console
 *
 * @param level {string} - fail, warn
 * @param what {string} - Text to prepend in blue
 * @param result {object}
 * @param result.state {boolean} - Check result
 * @param result.data {mixed} - Check input
 * @param describe {string, object} - Describe result, i.e. 'an Array'
 * @param describe.true {string} - Override default describe if true
 * @param describe.false {string} - Override default describe if false
 * @returns {void}
 */

function output (level, what, result, describe) {
  var state = (result.state === true) ? 'good' : level;
  var typestrGood = typeStr (result.data, true);
  var typestrFail = typeStr (result.data);
  var str = '';

  // log line
  switch (state) {
    case 'good': str = colorStr ('green', 'good'); break;
    case 'fail': str = colorStr ('red', 'FAIL'); break;
    case 'warn': str = colorStr ('yellow', 'warn'); break;
    default:
      // skip
      break;
  }

  str += '    ' + colorStr ('blue', what) + ' ';

  // describe result
  if (result.state) {
    str += describe.true || typestrGood + ' is ' + describe;
  } else {
    counters[level]++;
    str += describe.false || typestrFail + ' should be ' + describe;
  }

  // output
  console.log (str);
}


/**
 * Handle process exit
 *
 * @param [fromMethod] {boolean} - Used internally to prevent double logs
 * @param [code] {number} - Enforce exit status code if not fail
 * @returns {void}
 */

function processExit (fromProcess, code) {
  var timing = (Date.now () - counters.startTime) / 1000;

  // library mode
  if (config.noConsole) {
    return;
  }

  // tester mode
  if (fromProcess) {
    console.log ('\n');
    log ('info', colorStr ('yellow', counters.fail) + ' errors');
    log ('info', colorStr ('yellow', counters.warn) + ' warnings');
    console.log ();
    log ('info', colorStr ('yellow', timing) + ' seconds');
    console.log ();
  }

  if (counters.fail) {
    process.exit (1);
  } else {
    process.exit (code || 0);
  }
}

process.on ('exit', function (code) {
  if (typeof onExitCallback === 'function') {
    onExitCallback (code);
  }

  processExit (true, code);
});


/**
 * Prevent errors from killing the process
 *
 * @param err {Error} - The error that occured
 * @returns {void}
 */

function uncaughtException (err) {
  log ('error', err);
}

process.on ('uncaughtException', uncaughtException);


/**
 * Methods for test()
 */

function testLog (level, str) {
  var typestr = typeStr (str);
  var doDump = typestr.match (/(object|array)/);

  if (typeof str === 'string') {
    log (level, str);
    return;
  }

  log (level, typestr);

  if (doDump) {
    log ('object', str);
  }
}

unitTests = {
  done: done,
  error: function error (str) {
    log ('error', str);
    return unitTests;
  },
  good: function good (str) {
    testLog ('good', str);
    return unitTests;
  },
  fail: function fail (str) {
    testLog ('fail', str);
    return unitTests;
  },
  warn: function warn (str) {
    testLog ('warn', str);
    return unitTests;
  },
  info: function info (str) {
    testLog ('info', str);
    return unitTests;
  },
  exit: function exit () {
    testLog ('info', 'Exit process');
    processExit (false);
    return unitTests;
  }
};


/**
 * Test for Error
 *
 * @param level {string} - fail, warn
 * @param what {string} - describe input data, i.e. 'data.sub'
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isError = function isError (level, what, input) {
  var result = {
    state: getType (input) === 'error',
    data: input
  };

  output (level, what, result, 'an Error');
  return unitTests;
};


/**
 * Test for Object
 *
 * @param level {string} - fail, warn
 * @param what {string} - describe input data, i.e. 'data.sub'
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isObject = function isObject (level, what, input) {
  var result = {
    state: getType (input) === 'object',
    data: input
  };

  output (level, what, result, 'an Object');
  return unitTests;
};


/**
 * Test for Array
 *
 * @param level {string} - fail, warn
 * @param what {string} - describe input data, i.e. 'data.sub'
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isArray = function isArray (level, what, input) {
  var result = {
    state: getType (input) === 'array',
    data: input
  };

  output (level, what, result, 'an Array');
  return unitTests;
};


/**
 * Test for String
 *
 * @param level {string} - fail, warn
 * @param what {string} - describe input data, i.e. 'data.sub'
 * @param input {mixed} - variable to test againstuncaughtException
 * @returns {object} - unitTests
 */

unitTests.isString = function isString (level, what, input) {
  var result = {
    state: getType (input) === 'string',
    data: input
  };

  output (level, what, result, 'a String');
  return unitTests;
};


/**
 * Test for Number
 *
 * @param level {string} - fail, warn
 * @param what {string} - describe input data, i.e. 'data.sub'
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isNumber = function isNumber (level, what, input) {
  var result = {
    state: getType (input) === 'number',
    data: input
  };

  output (level, what, result, 'a Number');
  return unitTests;
};


/**
 * Test for Undefined
 *
 * @param level {string} - fail, warn
 * @param what {string} - describe input data, i.e. 'data.sub'
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isUndefined = function isUndefined (level, what, input) {
  var result = {
    state: getType (input) === 'undefined',
    data: input
  };

  output (level, what, result, 'Undefined');
  return unitTests;
};


/**
 * Test for null
 *
 * @param level {string} - fail, warn
 * @param what {string} - describe input data, i.e. 'data.sub'
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isNull = function isNull (level, what, input) {
  var result = {
    state: input === null,
    data: input
  };

  output (level, what, result, 'Null');
  return unitTests;
};


/**
 * Test for NaN
 *
 * @param level {string} - fail, warn
 * @param what {string} - describe input data, i.e. 'data.sub'
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isNaN = function isNan (level, what, input) {
  var result = {
    state: isNaN (input),
    data: input
  };

  output (level, what, result, 'NaN');
  return unitTests;
};


/**
 * Test for Boolean
 *
 * @param level {string} - fail, warn
 * @param what {string} - describe input data, i.e. 'data.sub'
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isBoolean = function isBoolean (level, what, input) {
  var result = {
    state: getType (input) === 'boolean',
    data: input
  };

  output (level, what, result, 'a Boolean');
  return unitTests;
};


/**
 * Test for Function
 *
 * @param level {string} - fail, warn
 * @param what {string} - describe input data, i.e. 'data.sub'
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isFunction = function isFunction (level, what, input) {
  var result = {
    state: getType (input) === 'function',
    data: input
  };

  output (level, what, result, 'a Function');
  return unitTests;
};


/**
 * Test for Date
 *
 * @param level {string} - fail, warn
 * @param what {string} - describe input data, i.e. 'data.sub'
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isDate = function isDate (level, what, input) {
  var result = {
    state: getType (input) === 'date',
    data: input
  };

  output (level, what, result, 'a Date');
  return unitTests;
};


/**
 * Check if two values are exactly the same
 *
 * @param level {string} - fail, warn
 * @param what {string} - describe input data, i.e. 'data.sub'
 * @param one {mixed} - variable to test against
 * @param two {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isExactly = function isExactly (level, what, one, two) {
  var typestrOne = typeStr (one);
  var typestrTwo = typeStr (two);
  var result = {
    state: one === two,
    data: two
  };

  var describe = {
    true: 'is exactly ' + typestrTwo,
    false: typestrOne + ' should be exactly ' + typestrTwo
  };

  output (level, what, result, describe);
  return unitTests;
};


/**
 * Check if two values are not the same
 *
 * @param level {string} - fail, warn
 * @param what {string} - describe input data, i.e. 'data.sub'
 * @param one {mixed} - variable to test against
 * @param two {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isNot = function isNot (level, what, one, two) {
  var typestrOne = typeStr (one);
  var typestrTwo = typeStr (two);
  var result = {
    state: one !== two,
    data: two
  };

  var describe = {
    true: typestrOne + ' is not equal to ' + typestrTwo,
    false: typestrOne + ' should not be equal to ' + typestrTwo
  };

  output (level, what, result, describe);
  return unitTests;
};


/**
 * Check if input is a RegExp
 *
 * @param level {string} - fail, warn
 * @param what {string} - describe input data, i.e. 'data.sub'
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isRegexp = function isRegexp (level, what, input) {
  var result = {
    state: getType (input) === 'regexp',
    data: input
  };

  output (level, what, result, 'a RegExp');
  return unitTests;
};


/**
 * Check if a string matches a regex
 *
 * @param level {string} - fail, warn
 * @param what {string} - describe input data, i.e. 'data.sub'
 * @param input {mixed} - variable to test against
 * @param regex {mixed} - regular expression to match
 * @returns {object} - unitTests
 */

unitTests.isRegexpMatch = function isRegexpMatch (level, what, input, regex) {
  var typestrOne = typeStr (input);
  var typestrTwo = typeStr (regex);
  var result = {
    state: !!~input.match (regex),
    data: input
  };

  var describe = {
    true: typestrOne + ' is matching ' + typestrTwo,
    false: typestrOne + ' should be matching ' + typestrTwo
  };

  output (level, what, result, describe);
  return unitTests;
};


/**
 * Check if the two values meet the condition
 *
 * @param level {string} - fail, warn
 * @param what {string} - describe the test
 * @param one {mixed} - variable to test against
 * @param operator {string} - < > <= >=
 * @param two {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isCondition = function isCondition (level, what, one, operator, two) {
  var typestrOne = typeStr (one);
  var typestrTwo = typeStr (two);
  var result = {
    state: false,
    data: two
  };

  var str = typestrOne + ' ' + colorStr ('yellow', operator) + ' ' + typestrTwo;

  var describe = {
    true: str,
    false: str
  };

  switch (operator) {
    case '<': result.state = one < two; break;
    case '>': result.state = one > two; break;
    case '<=': result.state = one <= two; break;
    case '>=': result.state = one >= two; break;
    default: result.state = false; break;
  }

  output (level, what, result, describe);
  return unitTests;
};


/**
 * Check if input is an empty var, string, object, array, error
 *
 * @param level {string} - fail, warn
 * @param what {string} - describe input data, i.e. 'data.sub'
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isEmpty = function isEmpty (level, what, input) {
  var type = getType (input);
  var result = {
    state: false,
    data: input
  };

  if (type === 'undefined') {
    result.state = true;
  } else if (input === null) {
    result.state = true;
  } else if (type === 'string' && !input) {
    result.state = true;
  } else if (type === 'object' && !Object.keys (input).length) {
    result.state = true;
  } else if (type === 'array' && !input.length) {
    result.state = true;
  } else if (type === 'error' && !Object.keys (input).length && !input.message) {
    result.state = true;
  }

  output (level, what, result, 'Empty');
  return unitTests;
};


/**
 * Check if input is not an empty var, string, object, array, error
 *
 * @param level {string} - fail, warn
 * @param what {string} - describe input data, i.e. 'data.sub'
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isNotEmpty = function isNotEmpty (level, what, input) {
  var type = getType (input);
  var result = {
    state: true,
    data: input
  };

  if (type === 'undefined') {
    result.state = false;
  } else if (input === null) {
    result.state = false;
  } else if (type === 'string' && !input) {
    result.state = false;
  } else if (type === 'object' && !Object.keys (input).length) {
    result.state = false;
  } else if (type === 'array' && !input.length) {
    result.state = false;
  } else if (type === 'error' && !Object.keys (input).length && !input.message) {
    result.state = false;
  }

  output (level, what, result, 'not Empty');
  return unitTests;
};


function test (err) {
  if (err) {
    log ('error', err);
  }

  return unitTests;
}

testFunc = test;


/**
 * Start tests
 *
 * @param wait {number=0} - Wait time between tests, in ms (1000 = 1 sec)
 * @returns {void}
 */

function run (wait) {
  config.wait = process.env.DOTEST_WAIT || wait || 0;

  if (!config.noConsole && next === -1) {
    log ('note', 'Running tests...\n');
    log ('note', 'Module name:      ' + colorStr ('yellow', pkg.name));
    log ('note', 'Module version:   ' + colorStr ('yellow', pkg.version));
    log ('note', 'Node.js version:  ' + colorStr ('yellow', process.versions.node));
    log ('note', 'dotest version:   ' + colorStr ('yellow', lib.version));

    if (pkg.bugs && pkg.bugs.url) {
      console.log ();
      log ('note', 'Module issues:    ' + colorStr ('yellow', pkg.bugs.url));
    }
  }

  done ();
}


/**
 * Add a test to the queue
 *
 * @param label {string} - Text to describe test
 * @param runner {function} - The function with test code, `function (test) { test().isObject(...); }`
 * @returns {void}
 */

function add (label, runner) {
  queue.push ({
    label: label,
    runner: runner
  });
}


/**
 * Set callback that runs when process exits
 *
 * @callcack callback
 * @param callback {function} - `function (code) {}`
 * @returns {void}
 */

function onExit (callback) {
  onExitCallback = callback;
}


/**
 * Change configuration
 *
 * @param name {object, string) - Config param or object
 * @param [name.noConsole = false] {boolean} - Don't console.log anything
 * @param [value] {string) - Param value if name is a string
 */

function setConfig (name, value) {
  var key;

  if (name instanceof Object) {
    for (key in name) {
      config [key] = name [key];
    }

    return;
  }

  config [name] = value;
}


/**
 * Module interface
 */

module.exports = {
  package: pkg,
  add: add,
  run: run,
  log: log,
  test: test,
  exit: unitTests.exit,
  onExit: onExit,
  colorStr: colorStr,
  getType: getType,
  config: setConfig,
  get length () {
    return queue.length;
  }
};
