# promise-stopwatch [![Build Status](https://travis-ci.org/songkick/promise-stopwatch.svg)](https://travis-ci.org/songkick/promise-stopwatch) [![Code Climate](https://codeclimate.com/github/songkick/promise-stopwatch/badges/gpa.svg)](https://codeclimate.com/github/songkick/promise-stopwatch) [![Test Coverage](https://codeclimate.com/github/songkick/promise-stopwatch/badges/coverage.svg)](https://codeclimate.com/github/songkick/promise-stopwatch/coverage)

Measure a Promise resolution duration using Performance API with fallback to `new Data()`.

```js
var stopwatch = require('promise-stopwatch');
function resolveInOneSec() {
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('yay');
    }, 1000);
  });
}

var settings = {}; // there is none available for now

stopwatch(settings)(resolveInOneSec)().then(function(response){
  var result = response.result;  // === 'yay'
  var duration = response.duration; // ~== 1000
  var settings = response.settings; // === {}

  console.log('Resolution took ' + duration + 'ms');

  return result; // return the result so you can handle it normally
});

function rejectInOneSec() {
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      reject('nay');
    }, 1000);
  });
}

stopwatch(settings)(rejectInOneSec)().catch(function(response){
  var error = response.error;  // === 'nay'
  var duration = response.duration; // ~== 1000
  var settings = response.settings; // === {}

  console.log('Rejection took ' + duration + 'ms');

  throw error; // possibly re-throw the error so you can handle it normally
});
```

## Options

None, for now, but it might come, so we keep this signature similar to other promise helper and be able to some without change the API.

## See also

`promise-stopwatch` composes really well with the following promise helper:

* [`promise-retry`](https://github.com/songkick/promise-retry):
* [`promise-timeout`](https://github.com/songkick/promise-timeout):
* [`promise-reject-status-above`](https://github.com/songkick/promise-reject-status-above):
