var doTest = require ('./');

doTest.add ('Module interface', function () {
  doTest.test ()
    .isObject ('fail', 'exports', doTest)
    .isFunction ('fail', '.add', doTest.add)
    .isFunction ('fail', '.run', doTest.run)
    .isFunction ('fail', '.test', doTest.test)
    .done ();
});


doTest.add ('Methods', function (fake) {
  doTest.test ()
    .isError ('fail', '.isError', new Error ())
    .isObject ('fail', '.isObject', {})
    .isArray ('fail', '.isArray', [])
    .isString ('fail', '.isString', '')
    .isNumber ('fail', '.isNumber', 1)
    .isUndefined ('fail', '.isUndefined', fake)
    .isBoolean ('fail', '.isBoolean', true)
    .isFunction ('fail', '.isFunction', function () {})
    .isExactly ('fail', '.isExactly', ':)', ':)')
    .isNotEmpty ('fail', '.isNotEmpty', 'text')
    .done ();
});


doTest.run ();
