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
var counters = {
  fail: 0,
  warn: 0,
  startTime: Date.now ()
};

var config = {
  wait: 0
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
      console.log ();
      console.log (str.stack);
      console.log ();
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
    '\n'
    + colorStr ('cyan', (index + 1) + '/' + queue.length)
    + '  '
    + colorStr ('bold', queue [index] .label)
  );

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
  var typeMatch = type.match (/(string|boolean|number|date|regexp|array)/);

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
        + (!noType && ' (' + type + ')');

      return str;
    }
  }

  // parse rest
  str = str && str.toString () || str;

  if (type === 'boolean') {
    str = str ? 'true' : 'false';
  }

  if (typeMatch && str.length && str.length <= 50) {
    return colorStr ('magenta', str)
      + (!noType && ' (' + type + ')');
  }

  return colorStr ('magenta', type);
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

  if (fromProcess) {
    console.log ();
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

  if (typeof str === 'string') {
    log (level, str);
    return;
  }

  log (level, typestr);

  if (typestr.length >= 60) {
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
    state: input instanceof Error,
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
    state: input instanceof Object,
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
    state: input instanceof Array,
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
    state: typeof input === 'string',
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
    state: typeof input === 'number',
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
    state: typeof input === 'undefined',
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

unitTests.isNull = function isUndefined (level, what, input) {
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

unitTests.isNaN = function isUndefined (level, what, input) {
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
    state: typeof input === 'boolean',
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
    state: typeof input === 'function',
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

unitTests.isDate = function isFunction (level, what, input) {
  var result = {
    state: input instanceof Date,
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
    state: input instanceof RegExp,
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

  if (next === -1) {
    log ('note', 'Running tests...\n');
    log ('note', 'Module name:      ' + colorStr ('yellow', pkg.name));
    log ('note', 'Module version:   ' + colorStr ('yellow', pkg.version));
    log ('note', 'Node.js version:  ' + colorStr ('yellow', process.versions.node));
    log ('note', 'dotest version:   ' + colorStr ('yellow', lib.version));
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
 * Module interface
 */

module.exports = {
  add: add,
  run: run,
  log: log,
  test: test,
  exit: unitTests.exit
};
