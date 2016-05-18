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
    .isFunction ('fail', '.colorStr', doTest.colorStr)
    .isFunction ('fail', '.getType', doTest.getType)
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
    .isObject ('fail', 'test() return', test ())
    .done ();

  testsDone++;
});


doTest.add ('Methods', function (test, fake) {
  var colorTest = doTest.colorStr ('magenta', 'magenta');
  var colorMatch = '\u001b[35mmagenta\u001b[0m';

  doTest.test ()
    .isError ('fail', 'test() .isError', new Error ())
    .isObject ('fail', 'test() .isObject', {})
    .isArray ('fail', 'test() .isArray', [])
    .isString ('fail', 'test() .isString', 'hello')
    .isNumber ('fail', 'test() .isNumber', 1)
    .isUndefined ('fail', 'test() .isUndefined', fake)
    .isNull ('fail', 'test() .isNull', null)
    .isNaN ('fail', 'test() .isNaN', NaN)
    .isBoolean ('fail', 'test() .isBoolean', true)
    .isFunction ('fail', 'test() .isFunction', function () {})
    .isDate ('fail', 'test() .isDate', new Date ())
    .isExactly ('fail', 'test() .isExactly', ':)', ':)')
    .isNot ('fail', 'test() .isNot', 'a', 'b')
    .isRegexp ('fail', 'test() .isRegexp', /^\w$/)
    .isRegexpMatch ('fail', 'test() .isRegexpMatch', 'a', /^\w$/)
    .isCondition ('fail', 'test() .isCondition', 1, '<', 2)
    .isEmpty ('fail', 'test() .isEmpty', '')
    .isNotEmpty ('fail', 'test() .isNotEmpty', 'text')
    .isExactly ('fail', '.getType', doTest.getType ([]), 'array')
    .isExactly ('fail', '.colorStr', colorTest, colorMatch)
    .warn ('This is a warn message')
    .good ('This is a good message')
    .done ();

  testsDone++;
});


doTest.add ('Method test.info', function (test) {
  doTest.test ()
    .info ('-- Short object:')
    .info ({ hello: 'world' })
    .info ('-- Long object:')
    .info (test ())

    .info ('-- Short array:')
    .info (['one', 'two'])
    .info ('-- Long array:')
    .info (process.mainModule.paths)

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
