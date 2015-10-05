var tap = require('tap');
// Mock Date.now to ease testing
// if mock is true,
// the difference between 2 calls will always be ONE_TICK
var originalNow = Date.now.bind(Date);
var callCount = 0;
var mock = false;
var ONE_TICK = 50;
Date.now = function() {
    if (mock) {
        return ++callCount * ONE_TICK;
    }
    return originalNow();
};

var stopwatch = require('./index');

function resolveAsync() {
    return new Promise(function(resolve){
        setTimeout(function(){
            resolve('yay');
        }, 10);
    });
}

function rejectAsync() {
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            reject('nay');
        }, 10);
    });
}

tap.test('it should resolve with the original resolution response and duration', function(t){
    t.plan(3);
    mock = true;
     var settings = {foo:'bar'}; // not used but we need to make sure they are passed
    stopwatch(settings)(resolveAsync)().then(function(response){
        mock = false;
        t.equal(response.result, 'yay', 'original response was not returned');
        t.equal(response.duration, ONE_TICK, 'returned duration does not match');
        t.equal(response.settings, settings, 'settings were not passed');
    });
});

tap.test('it should reject with the original rejection error and duration', function(t){
    t.plan(2);
    mock = true;
    stopwatch()(rejectAsync)().catch(function(response){
        mock = false;
        t.equal(response.error, 'nay', 'original error was not returned');
        t.equal(response.duration, ONE_TICK, 'returned duration does not match');
    });
});

tap.test('it should use performance.now when available', function(t){
    t.plan(3);
    var perfCallCount = 0;
    global.performance = {
        now: function(){
            return ++perfCallCount * ONE_TICK;
        }
    };
    stopwatch()(resolveAsync)().then(function(response){
        t.equal(perfCallCount, 2, 'performance.now was not used');
        t.equal(response.result, 'yay', 'original result was not returned');
        t.equal(response.duration, ONE_TICK, 'returned duration does not match');
    });
});
