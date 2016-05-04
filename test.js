var doTest = require ('./');

doTest.add ('Module interface', function () {
  var test = doTest.test ();

  test
    .isObject ('fail', 'exports', doTest)
    .isFunction ('fail', '.add', doTest.add)
    .isFunction ('fail', '.run', doTest.run)
    .isFunction ('fail', '.log', doTest.log)
    .isFunction ('fail', '.exit', doTest.exit)
    .isFunction ('fail', '.test', doTest.test)
    .isFunction ('fail', '.test.done', test.done)
    .isFunction ('fail', '.test.good', test.good)
    .isFunction ('fail', '.test.warn', test.warn)
    .isFunction ('fail', '.test.fail', test.fail)
    .isFunction ('fail', '.test.error', test.error)
    .isFunction ('fail', '.test.info', test.info)
    .isFunction ('fail', '.test.exit', test.exit)
    .done ();
});


doTest.add ('test() shortcut', function (test) {
  doTest.test ()
    .isFunction ('fail', 'test', test)
    .done ();
});


doTest.add ('Methods', function (test, fake) {
  doTest.test ()
    .isError ('fail', '.isError', new Error ())
    .isObject ('fail', '.isObject', {})
    .isArray ('fail', '.isArray', [])
    .isString ('fail', '.isString', '')
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
});


doTest.run ();
