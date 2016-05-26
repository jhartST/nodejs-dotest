// Load test runner and your app
var doTest = require ('dotest');

var app = {
  methodOne: function (callback) {
    var data = {
      music: ['song']
    };

    callback (null, data);
  },
  sub: {
    methodTwo: function () {}
  }
};

// Check app interface
doTest.add ('App interface', function (test) {
  test ()
    .isFunction ('fail', 'methodOne', app.methodOne)
    .isObject ('fail', 'sub', app.sub)
    .isFunction ('fail', 'sub.methodTwo', app.sub.methodTwo)
    .done ();
});

// Check method response
doTest.add ('App methodOne', function (test) {
  app.methodOne (function (err, data) {
    test (err)
      .isObject ('fail', 'Callback data', data)
      .isArray ('fail', 'data.music', data.music)
      .isNotEmpty ('warn', 'data.music', data.music)
      .done ();
  });
});

// Run the tests
doTest.run ();
