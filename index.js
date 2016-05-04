/*
Name:           doTest - Unit tests runner
Description:    Yet another unit test runner for Node.js
Author:         Franklin van de Meent (https://frankl.in)
Source & docs:  https://github.com/fvdm/nodejs-dotest
Feedback:       https://github.com/fvdm/nodejs-dotest/issues
License:        Unlicense (public domain, see LICENSE file)
*/

var path = require ('path');
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
 * Write test result to console
 *
 * @param data {object}
 * @param data.result {boolean} - Test outcome
 * @param data.level {string} - fail, warn
 * @param data.what {string} - describe input data, i.e. 'data.sub'
 * @param data.describe {string} - Human text to describe outcome
 * @returns {void}
 */

function output (data) {
  var state = (data.result === true) ? 'good' : data.level;
  var str = '';

  switch (state) {
    case 'good': str = colorStr ('green', 'good'); break;
    case 'fail': str = colorStr ('red', 'FAIL'); break;
    case 'warn': str = colorStr ('yellow', 'warn'); break;
    default:
      // skip
      break;
  }

  str += '    ' + colorStr ('blue', data.what) + ' ' + data.describe;
  console.log (str);
}


/**
 * Get any var type
 * The order of if's is important
 *
 * @param input {mixed} - The value to check
 * @returns {string} - Lowercase type
 */

function getType (input) {
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
 * @returns {string} - i.e. hello (string)
 */

function typeStr (str) {
  var type = getType (str);
  var typeMatch = type.match (/(string|date|regexp|array)/);

  str = str && str.toString () || str;

  if (typeMatch && str.length && str.length < 20) {
    return colorStr ('magenta', str) + ' (' + type + ')';
  }

  return colorStr ('magenta', type);
}


/**
 * Handle process exit
 *
 * @param [fromMethod] {boolean} - Used internally to prevent double logs
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
  if (typeof str === 'string') {
    log (level, str);
  } else {
    log (level, typeStr (str));
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
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: getType (input) === 'error',
    what: what,
    get describe () {
      if (this.result) {
        return 'is an Error';
      }

      counters[level]++;
      return typestr + ' is not an Error';
    }
  };

  output (data);
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
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: getType (input) === 'object',
    what: what,
    get describe () {
      if (this.result) {
        return 'is an Object';
      }

      counters[level]++;
      return typestr + ' is not an Object';
    }
  };

  output (data);
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
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: getType (input) === 'array',
    what: what,
    get describe () {
      if (this.result) {
        return 'is an Array';
      }

      counters[level]++;
      return typestr + ' is not an Array';
    }
  };

  output (data);
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
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: getType (input) === 'string',
    what: what,
    get describe () {
      if (this.result) {
        return 'is a String';
      }

      counters[level]++;
      return typestr + ' is not a String';
    }
  };

  output (data);
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
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: getType (input) === 'number',
    what: what,
    get describe () {
      if (this.result) {
        return 'is a Number';
      }

      counters[level]++;
      return typestr + ' is not a Number';
    }
  };

  output (data);
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
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: getType (input) === 'undefined',
    what: what,
    get describe () {
      if (this.result) {
        return 'is Undefined';
      }

      counters[level]++;
      return typestr + ' is not Undefined';
    }
  };

  output (data);
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
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: getType (input) === 'null',
    what: what,
    get describe () {
      if (this.result) {
        return 'is Null';
      }

      counters[level]++;
      return typestr + ' is not Null';
    }
  };

  output (data);
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
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: isNaN (input),
    what: what,
    get describe () {
      if (this.result) {
        return 'is NaN';
      }

      counters[level]++;
      return typestr + ' should be NaN';
    }
  };

  output (data);
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
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: getType (input) === 'boolean',
    what: what,
    get describe () {
      if (this.result) {
        return 'is a Boolean';
      }

      counters[level]++;
      return typestr + ' is not a Boolean';
    }
  };

  output (data);
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
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: getType (input) === 'function',
    what: what,
    get describe () {
      if (this.result) {
        return 'is a Function';
      }

      counters[level]++;
      return typestr + ' is not a Function';
    }
  };

  output (data);
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
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: input instanceof Date,
    what: what,
    get describe () {
      if (this.result) {
        return 'is a Date';
      }

      counters[level]++;
      return typestr + ' should be a Date';
    }
  };

  output (data);
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
  var data = {
    level: level,
    result: one === two,
    what: what,
    get describe () {
      var str = '';

      if (this.result) {
        return 'is exactly ' + typestrTwo;
      }

      str += typestrOne + ' should be exactly ' + typestrTwo;

      counters[level]++;
      return str;
    }
  };

  output (data);
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
  var data = {
    level: level,
    result: one !== two,
    what: what,
    get describe () {
      var str = '';

      if (this.result) {
        return 'is not equal to ' + typestrTwo;
      }

      str += typestrOne + ' should not be equal to ' + typestrTwo;

      counters[level]++;
      return str;
    }
  };

  output (data);
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
  var typestrOne = typeStr (input);
  var data = {
    level: level,
    result: input instanceof RegExp,
    what: what,
    get describe () {
      var str = '';

      if (this.result) {
        return 'is a RegExp';
      }

      str += typestrOne + ' should be a RegExp';

      counters[level]++;
      return str;
    }
  };

  output (data);
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
  var data = {
    level: level,
    result: !!~input.match (regex),
    what: what,
    get describe () {
      var str = '';

      if (this.result) {
        return 'is matching ' + typestrTwo;
      }

      str += typestrOne + ' should be exactly ' + typestrTwo;

      counters[level]++;
      return str;
    }
  };

  output (data);
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
  var data = {
    level: level,
    result: false,
    what: what,
    get describe () {
      var str = typestrOne + ' ' + operator + ' ' + typestrTwo;

      if (!this.result) {
        counters[level]++;
      }

      return str;
    }
  };

  switch (operator) {
    case '<': data.result = one < two; break;
    case '>': data.result = one > two; break;
    case '<=': data.result = one <= two; break;
    case '>=': data.result = one >= two; break;
    default: data.result = false; break;
  }

  output (data);
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
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: false,
    what: what,
    get describe () {
      if (this.result) {
        return typestr + ' is empty';
      }

      counters[level]++;
      return typestr + ' should be empty';
    }
  };

  if (type === 'undefined') {
    data.result = true;
  } else if (input === null) {
    data.result = true;
  } else if (type === 'string' && !input) {
    data.result = true;
  } else if (type === 'object' && !Object.keys (input).length) {
    data.result = true;
  } else if (type === 'array' && !input.length) {
    data.result = true;
  } else if (type === 'error' && !Object.keys (input).length && !input.message) {
    data.result = true;
  }

  output (data);
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
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: true,
    what: what,
    get describe () {
      if (this.result) {
        return typestr + ' is not empty';
      }

      counters[level]++;
      return typestr + ' should not be empty';
    }
  };

  if (type === 'undefined') {
    data.result = false;
  } else if (input === null) {
    data.result = false;
  } else if (type === 'string' && !input) {
    data.result = false;
  } else if (type === 'object' && !Object.keys (input).length) {
    data.result = false;
  } else if (type === 'array' && !input.length) {
    data.result = false;
  } else if (type === 'error' && !Object.keys (input).length && !input.message) {
    data.result = false;
  }

  output (data);
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
