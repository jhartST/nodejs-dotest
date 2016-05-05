var doTest = require ('./');

var testsDone = 0;


// Tests
doTest.add ('Module interface', function () {
  var test = doTest.test ();

  test
    .isObject ('fail', 'exports', doTest)
    .isFunction ('fail', '.add', doTest.add)
    .isFunction ('fail', '.run', doTest.run)
    .isFunction ('fail', '.log', doTest.log)
    .isFunction ('fail', '.exit', doTest.exit)
    .isFunction ('fail', '.onExit', doTest.onExit)
    .isFunction ('fail', '.test', doTest.test)
    .isFunction ('fail', '.test.done', test.done)
    .isFunction ('fail', '.test.good', test.good)
    .isFunction ('fail', '.test.warn', test.warn)
    .isFunction ('fail', '.test.fail', test.fail)
    .isFunction ('fail', '.test.error', test.error)
    .isFunction ('fail', '.test.info', test.info)
    .isFunction ('fail', '.test.exit', test.exit)
    .done ();

  testsDone++;
});


doTest.add ('test() shortcut', function (test) {
  doTest.test ()
    .isFunction ('fail', 'test', test)
    .done ();

  testsDone++;
});


doTest.add ('Methods', function (test, fake) {
  doTest.test ()
    .isError ('fail', '.isError', new Error ())
    .isObject ('fail', '.isObject', {})
    .isArray ('fail', '.isArray', [])
    .isString ('fail', '.isString', 'hello')
    .isNumber ('fail', '.isNumber', 1)
    .isUndefined ('fail', '.isUndefined', fake)
    .isNull ('fail', '.isNull', null)
    .isNaN ('fail', '.isNaN', NaN)
    .isBoolean ('fail', '.isBoolean', true)
    .isFunction ('fail', '.isFunction', function () {})
    .isDate ('fail', '.isDate', new Date ())
    .isExactly ('fail', '.isExactly', ':)', ':)')
    .isNot ('fail', '.isNot', 'a', 'b')
    .isRegexp ('fail', '.isRegexp', /^\w$/)
    .isRegexpMatch ('fail', '.isRegexpMatch', 'a', /^\w$/)
    .isCondition ('fail', '.isCondition', 1, '<', 2)
    .isEmpty ('fail', '.isEmpty', '')
    .isNotEmpty ('fail', '.isNotEmpty', 'text')
    .warn ('This is a warn message')
    .good ('This is a good message')
    .info ({ hello: 'world' })
    .done ();

  testsDone++;
});


doTest.add ('onExit', function (test) {
  testsDone++;

  doTest.onExit (function (code) {
    test ()
      .info ('This is the onExit() callback')
      .isNumber ('fail', 'code', code)
      .isExactly ('warn', 'code', code, 0)
      .isExactly ('warn', 'testsDone', testsDone, doTest.length)
      .done ();
  });
});


doTest.run ();
