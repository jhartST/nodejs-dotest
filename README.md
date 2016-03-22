dotest
======

Yet another unit test runner for Node.js

[![Build Status](https://travis-ci.org/fvdm/nodejs-dotest.svg?branch=master)](https://travis-ci.org/fvdm/nodejs-dotest)

[![Console example](https://frankl.in/wp-content/uploads/2016/03/dotest_planetos-496x400.png)](https://frankl.in/micro/nodejs-dotest-console-output)

Example
-------

```js
// Load test runner and your app
var doTest = require ('dotest');
var app = require ('./');

// Check app interface
doTest.add ('App interface', function () {
  doTest.test ()
    .isFunction ('fail', 'methodOne', app.methodOne)
    .isObject ('fail', 'sub', app.sub)
    .isFunction ('fail', 'sub.methodTwo', app.sub.methodTwo)
    .done ();
});

// Check method response
doTest add ('App methodOne', function () {
  app.methodOne (function (err, data) {
    doTest.test (err)
      .isObject ('fail', 'Callback data', data)
      .isArray ('fail', 'data.music', data.music)
      .isNotEmpty ('warn', 'data.music', data.music)
      .done ();
  });
});

// Run the tests
doTest.run ();
```


Methods
-------

### .add
**( label, testFunction )**

Add a new test to the queue.

```js
doTest.add ('App interface', function () {
  // Your code
});
```


### .run
**()**

Run the tests from the queue, one by one.

```js
doTest.run ();
```


### .log
**( [type], str )**

Fancy `console.log` with style.


param | type   | required | default | description
:-----|:-------|:---------|:--------|:------------------------------
type  | string | no       | plain   | Text style to apply, see below
str   | string | yes      |         | The string to output


style | description
:-----|:------------------------------------
fail  | `FAIL    Text` with _FAIL_ in red
good  | `good    Text` with _good_ in green
warn  | `warn    Text` with _warn_ in yellow
info  | `info    Text` with _info_ in cyan
note  | `Text` with _Text_ in bold
error | `ERROR   Error.message\nError\nError.stack` with _ERROR_ in red
plain | No styling


```js
// Bold text
doTest.log ('note', 'Hello world');
```


### .exit
**()**

Force exit the process, after writing statistics to the console.

```js
doTest.exit ();
```


### .test
**( [err] )**

Returns check functions.
Optionally test for `err` instance of `Error` and dump it to the console.

The check functions take a `level` parameter.
When set to `fail` the check reports _fail_ and the whole test script will eventually fail.
When set to `warn` the check reports _warn_ but won't cause the script to fail.

You can concat the check functions for clean code.


```js
doTest.add ('App interface', function () {
  doTest.test ()
    .isObject ('fail', 'Callback data', data)
    .done ();
});
```


#### .done
**( [callback] )**

Run the next test from the queue.
Optionally run a `callback` function before the next test.

See example above.


#### .isError
**( level, what, input )**

Check if `input` is an instance of _Error_.


param | type   | required | description
:-----|:-------|:---------|:-------------------------------
level | string | yes      | Either `fail` or `warn`
what  | string | yes      | Text to prepend to check result
input | mixed  | yes      | The variable to check


```js
doTest.test () .isError ('fail', 'My data', data);
```


#### .isObject
**( level, what, input )**

Check if `input` is an instance of _Object_.


param | type   | required | description
:-----|:-------|:---------|:-------------------------------
level | string | yes      | Either `fail` or `warn`
what  | string | yes      | Text to prepend to check result
input | mixed  | yes      | The variable to check


```js
doTest.test () .isError ('fail', 'My data', data);
```


#### .isArray
**( level, what, input )**

Check if `input` is an instance of _Array_.


param | type   | required | description
:-----|:-------|:---------|:-------------------------------
level | string | yes      | Either `fail` or `warn`
what  | string | yes      | Text to prepend to check result
input | mixed  | yes      | The variable to check


```js
doTest.test () .isArray ('fail', 'My data', data);
```


#### .isString
**( level, what, input )**

Check if `input` is a _string_.


param | type   | required | description
:-----|:-------|:---------|:-------------------------------
level | string | yes      | Either `fail` or `warn`
what  | string | yes      | Text to prepend to check result
input | mixed  | yes      | The variable to check


```js
doTest.test () .isString ('fail', 'My data', data);
```


#### .isNumber
**( level, what, input )**

Check if `input` is a _number_.


param | type   | required | description
:-----|:-------|:---------|:-------------------------------
level | string | yes      | Either `fail` or `warn`
what  | string | yes      | Text to prepend to check result
input | mixed  | yes      | The variable to check


```js
doTest.test () .isNumber ('fail', 'My data', data);
```


#### .isUndefined
**( level, what, input )**

Check if `input` is _undefined_.


param | type   | required | description
:-----|:-------|:---------|:-------------------------------
level | string | yes      | Either `fail` or `warn`
what  | string | yes      | Text to prepend to check result
input | mixed  | yes      | The variable to check


```js
function (err, data) {
  doTest.test () .isUndefined ('warn', 'My data', data);
}
```


#### .isNull
**( level, what, input )**

Check if `input` is _null_.


param | type   | required | description
:-----|:-------|:---------|:-------------------------------
level | string | yes      | Either `fail` or `warn`
what  | string | yes      | Text to prepend to check result
input | mixed  | yes      | The variable to check


```js
function (err, data) {
  doTest.test () .isNull ('warn', 'My data', data);
}
```


#### .isBoolean
**( level, what, input )**

Check if `input` is a _boolean_.


param | type   | required | description
:-----|:-------|:---------|:-------------------------------
level | string | yes      | Either `fail` or `warn`
what  | string | yes      | Text to prepend to check result
input | mixed  | yes      | The variable to check


```js
doTest.test () .isBoolean ('fail', 'My data', data);
```


#### .isFunction
**( level, what, input )**

Check if `input` is an instance of _Function_.


param | type   | required | description
:-----|:-------|:---------|:-------------------------------
level | string | yes      | Either `fail` or `warn`
what  | string | yes      | Text to prepend to check result
input | mixed  | yes      | The variable to check


```js
doTest.test () .isFunction ('fail', 'My data', data);
```


#### .isExactly
**( level, what, one, two )**

Check if `one` is exactly of the same type and value as `two`.


param | type   | required | description
:-----|:-------|:---------|:-------------------------------
level | string | yes      | Either `fail` or `warn`
what  | string | yes      | Text to prepend to check result
one   | mixed  | yes      | The variable to check
two   | mixed  | yes      | The variable to check against


```js
doTest.test () .isExactly ('fail', 'My data', 'foo', 'bar');
```


#### .isCondition
**( level, what, one, operator, two )**

Check if the two values meet the condition.


param    | type   | required | description
:--------|:-------|:---------|:-------------------------------
level    | string | yes      | Either `fail` or `warn`
what     | string | yes      | Text to prepend to check result
one      | mixed  | yes      | Variable to test against
operator | string |          | `<` `>` `<=` `>=`
two      | mixed  |          | Variable to test against


```js
doTest.test () .isExactly ('fail', 'My data', 1, '<', 2);
```


#### .isEmpty
**( level, what, input )**

Check if `input` is _undefined_, _null_, or an empty _string_, _object_, _array_ or _Error_.
In case of _Error_ the `input.message` and `Object.keys (input)` are checked.


param | type   | required | description
:-----|:-------|:---------|:-------------------------------
level | string | yes      | Either `fail` or `warn`
what  | string | yes      | Text to prepend to check result
input | mixed  | yes      | The variable to check


```js
doTest.test () .isEmpty ('fail', 'My data', data);
```


#### .isNotEmpty
**( level, what, input )**

Check if `input` is not _undefined_, _null_, or an empty _string_, _object_, _array_ or _Error_.
In case of _Error_ the `input.message` and `Object.keys (input)` are checked.


param | type   | required | description
:-----|:-------|:---------|:-------------------------------
level | string | yes      | Either `fail` or `warn`
what  | string | yes      | Text to prepend to check result
input | mixed  | yes      | The variable to check


```js
doTest.test () .isNotEmpty ('fail', 'My data', data);
```


License
-------

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org>


Author
------

Franklin van de Meent
| [Website](https://frankl.in)
| [Github](https://github.com/fvdm)
