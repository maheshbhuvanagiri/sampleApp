(function () {
    var app = angular.module('ClientToServer', []);
    app.service('logService', ['$http', function ($http) {
        this.log = function (message) {
            var resp = $http({
                method: 'post',
                url: '../api/log/log?message=' + message,
                contentType: 'application/json'
            });
            return resp;
        };
    }]);
    app.factory('stacktraceService', function () {
        // "printStackTrace" is a global object.
        return ({
            print: printStackTrace
        });
    });
    app.provider('$exceptionHandler',
              {
                  $get: function (errorLogService) {
                      return (errorLogService);
                  }
              }
          );
    app.factory('errorLogService', ['$log', '$window', 'stacktraceService', function ($log, $window, stacktraceService) {
        // I log the given error to the remote server.
        function log(exception, cause) {
            // Pass off the error to the default error handler
            // on the AngualrJS logger. This will output the
            // error to the console (and let the application
            // keep running normally for the user).
            $log.error.apply($log, arguments);
            // Now, we need to try and log the error the server.
            // --
            // NOTE: In production, I have some debouncing
            // logic here to prevent the same client from
            // logging the same error over and over again! All
            // that would do is add noise to the log.
            try {
                var errorMessage = exception.toString();
                var stackTrace = stacktraceService.print({ e: exception });
                // Log the JavaScript error to the server.
                $.ajax({
                    type: 'POST',
                    url: '../api/log/ExceptionLog',
                    contentType: 'application/json',
                    data: angular.toJson({
                        errorAddress: $window.location.href,
                        errorMessage: errorMessage,
                        stackTrace: stackTrace.toString(),
                        cause: (cause || '')
                    })
                });
            } catch (loggingError) {
                // For Developers - log the log-failure.
                $log.warn('Error logging failed');
                $log.log(loggingError);
            }
        }
        // Return the logging function.
        return (log);
    }]);
})();

