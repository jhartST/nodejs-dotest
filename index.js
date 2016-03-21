/*
Name:           doTest - Unit tests runner
Description:    Yet another unit test runner for Node.js
Author:         Franklin van de Meent (https://frankl.in)
Source & docs:  https://github.com/fvdm/nodejs-dotest
Feedback:       https://github.com/fvdm/nodejs-dotest/issues
License:        Unlicense (public domain, see LICENSE file)
*/

var path = require ('path');
var dir = path.parse (process.mainModule.filename) .dir;
var pkg = require (path.join (dir, 'package.json'));

var queue = [];
var next = -1;
var unitTests = {};
var counters = {
  fail: 0,
  warn: 0
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
    fail: ['red', 'FAIL'],
    good: ['green', 'good'],
    warn: ['yellow', 'warn'],
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
    case 'error':
      console.log (colorStr ('red', colorStr ('bold', 'ERROR   ')) + str.message + '\n');
      console.dir (str, {
        depth: null,
        colors: true
      });
      console.log ();
      console.log (str.stack);
      console.log ();
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
 * @callback callback
 * @param [callback] {function} - Run callback before next test
 * @returns {void}
 */

function doNext (callback) {
  if (callback instanceof Function) {
    callback (next);
  }

  next++;

  if (queue [next]) {
    console.log (
      '\n'
      + colorStr ('cyan', (next + 1) + '/' + queue.length)
      + '  '
      + colorStr ('bold', queue [next] .label)
    );
    queue [next] .runner ();
  }
}


unitTests = {
  done: doNext
};


/**
 * Write test result to console
 *
 * @param data {object}
 * @param data.result {boolean} - Test outcome
 * @param data.level {string} - fail, warn
 * @param data.describe {string} - Human text to describe outcome
 * @returns {void}
 */

function output (data) {
  var state = (data.result === true) ? 'good' : data.level;
  var str = '';

  switch (state) {
    case 'good': str = colorStr ('green', 'good'); break;
    case 'fail': str = colorStr ('red', 'fail'); break;
    case 'warn': str = colorStr ('yellow', 'warn'); break;
    default: str = str; break;
  }

  str += '    ' + data.describe;
  console.log (str);
}


/**
 * Get any var type
 *
 * @param input {mixed} - The value to check
 * @returns {string}
 */

function getType (input) {
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

  return (typeof input);
}


/**
 * Get formatted var type for console
 *
 * @param str {string} - The var to convert
 * @returns {string}
 */

function typeStr (str) {
  var type = getType (str);

  if (type === 'string' && str.length < 20) {
    str = '"' + str + '"';
  } else if (type === 'string') {
    str = 'string';
  } else if (str === null) {
    str = 'null';
  } else if (type === 'object') {
    str = 'object';
  } else if (type === 'array') {
    str = 'array';
  } else if (type === 'error') {
    str = 'error';
  }

  return colorStr ('magenta', str);
}


/**
 * Test for Error
 *
 * @param level {string} - fail, warn
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isError = function isError (level, what, input) {
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: getType (input) === 'error',
    get describe () {
      if (this.result) {
        return colorStr ('blue', what) + ' is an Error';
      }

      counters[level]++;
      return colorStr ('blue', what) + ' (' + typestr + ') is not an Error';
    }
  };

  output (data);
  return unitTests;
};


/**
 * Test for Object
 *
 * @param level {string} - fail, warn
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isObject = function isObject (level, what, input) {
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: getType (input) === 'object',
    get describe () {
      if (this.result) {
        return colorStr ('blue', what) + ' is an Object';
      }

      counters[level]++;
      return colorStr ('blue', what) + ' (' + typestr + ') is not an Object';
    }
  };

  output (data);
  return unitTests;
};


/**
 * Test for Array
 *
 * @param level {string} - fail, warn
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isArray = function isArray (level, what, input) {
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: getType (input) === 'array',
    get describe () {
      if (this.result) {
        return colorStr ('blue', what) + ' is an Array';
      }

      counters[level]++;
      return colorStr ('blue', what) + ' (' + typestr + ') is not an Array';
    }
  };

  output (data);
  return unitTests;
};


/**
 * Test for String
 *
 * @param level {string} - fail, warn
 * @param input {mixed} - variable to test againstuncaughtException
 * @returns {object} - unitTests
 */

unitTests.isString = function isString (level, what, input) {
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: getType (input) === 'string',
    get describe () {
      if (this.result) {
        return colorStr ('blue', what) + ' is a String';
      }

      counters[level]++;
      return colorStr ('blue', what) + ' (' + typestr + ') is not a String';
    }
  };

  output (data);
  return unitTests;
};


/**
 * Test for Number
 *
 * @param level {string} - fail, warn
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isNumber = function isNumber (level, what, input) {
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: getType (input) === 'number',
    get describe () {
      if (this.result) {
        return colorStr ('blue', what) + ' is a Number';
      }

      counters[level]++;
      return colorStr ('blue', what) + ' (' + typestr + ') is not a Number';
    }
  };

  output (data);
  return unitTests;
};


/**
 * Test for Undefined
 *
 * @param level {string} - fail, warn
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isUndefined = function isUndefined (level, what, input) {
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: getType (input) === 'undefined',
    get describe () {
      if (this.result) {
        return colorStr ('blue', what) + ' is Undefined';
      }

      counters[level]++;
      return colorStr ('blue', what) + ' (' + typestr + ') is not Undefined';
    }
  };

  output (data);
  return unitTests;
};


/**
 * Test for Boolean
 *
 * @param level {string} - fail, warn
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isBoolean = function isBoolean (level, what, input) {
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: getType (input) === 'boolean',
    get describe () {
      if (this.result) {
        return colorStr ('blue', what) + ' is a Boolean';
      }

      counters[level]++;
      return colorStr ('blue', what) + ' (' + typestr + ') is not a Boolean';
    }
  };

  output (data);
  return unitTests;
};


/**
 * Test for Function
 *
 * @param level {string} - fail, warn
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isFunction = function isFunction (level, what, input) {
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: getType (input) === 'function',
    get describe () {
      if (this.result) {
        return colorStr ('blue', what) + ' is a Function';
      }

      counters[level]++;
      return colorStr ('blue', what) + ' (' + typestr + ') is not a Function';
    }
  };

  output (data);
  return unitTests;
};


/**
 * Check if two values are exactly the same
 *
 * @param level {string} - fail, warn
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
    get describe () {
      var str = '';

      if (this.result) {
        str = colorStr ('blue', what) + ' is exactly ' + typestrTwo + ' (' + getType (two) + ')';
        return str;
      }

      str += colorStr ('blue', what) + ' ' + typestrOne + ' and ' + typestrTwo + '';
      str += ' are not exact matches';

      counters[level]++;
      return str;
    }
  };

  output (data);
  return unitTests;
};


/**
 * Check if input is not an empty var, string, object, array, error
 *
 * @param level {string} - fail, warn
 * @param input {mixed} - variable to test against
 * @returns {object} - unitTests
 */

unitTests.isNotEmpty = function isNotEmpty (level, what, input) {
  var type = getType (input);
  var typestr = typeStr (input);
  var data = {
    level: level,
    result: true,
    get describe () {
      if (this.result) {
        return colorStr ('blue', what) + ' (' + typestr + ') is not empty';
      }

      counters[level]++;
      return colorStr ('blue', what) + ' (' + typestr + ') should not be empty';
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
    counters.fail++;
    log ('error', err);
  }

  return unitTests;
}


/**
 * Start tests
 */

function run () {
  if (next === -1) {
    log ('note', 'Running tests...\n');
    log ('note', 'Module name:      ' + pkg.name);
    log ('note', 'Module version:   ' + pkg.version);
    log ('note', 'Node.js version:  ' + process.versions.node);
  }

  doNext ();
}


/**
 * Add a test to the queue
 */

function add (label, runner) {
  queue.push ({
    label: label,
    runner: runner
  });
}


/**
 * Handle process exit
 */

function processExit () {
  console.log ();
  log ('info', counters.fail + ' errors');
  log ('info', counters.warn + ' warnings');
  console.log ();

  if (counters.fail) {
    process.exit (1);
  } else {
    process.exit (0);
  }
}

process.on ('exit', processExit);


/**
 * Prevent errors from killing the process
 */

function uncaughtException (err) {
  console.log (err);
  console.log ();
  console.log (err.stack);
  console.log ();
  counters.fail++;
}

process.on ('uncaughtException', uncaughtException);


/**
 * Module interface
 */

module.exports = {
  add: add,
  run: run,
  log: log,
  test: test,
  exit: processExit
};
