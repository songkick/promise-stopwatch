var factory = function (createExecutor) {
    return function (settings) {
        return function (fn) {
            return function () {
                return new Promise(createExecutor(fn, settings));
            };
        };
    }
};

module.exports = factory(function (fn, settings) {

    var now = typeof performance !== 'undefined' && performance.now ? performance.now.bind(performance) : Date.now.bind(Date);

    settings = settings || {};

    function executor(resolve, reject) {

        var start = now();

        var originalPromise = fn()

        originalPromise.then(function(result){
            resolve({
                duration: now() - start,
                result: result,
                settings: settings
            });
        });

        originalPromise.catch(function(error){
            reject({
                duration: now() - start,
                error: error,
                settings: settings
            });
        });
    }

    return executor;
});
