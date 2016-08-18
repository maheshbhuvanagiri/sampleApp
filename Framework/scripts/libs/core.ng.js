(function (core, angular) {

    if (!angular) {
        return;
    }

    core.ng = core.ng || {};

    core.ng.http = {
        defaultError: {
            message: 'Ajax request did not succeed!',
            details: 'Error detail not sent by server.'
        },

        logError: function (error) {
            core.log.error(error);
        },

        showError: function (error) {
            if (error.details) {
                return core.message.error(error.details, error.message || core.ng.http.defaultError.message);
            } else {
                return core.message.error(error.message || core.ng.http.defaultError.message);
            }
        },

        handleTargetUrl: function (targetUrl) {
            location.href = targetUrl;
        },

        handleUnAuthorizedRequest: function (messagePromise, targetUrl) {
            if (messagePromise) {
                messagePromise.done(function () {
                    if (!targetUrl) {
                        location.reload();
                    } else {
                        core.ng.http.handleTargetUrl(targetUrl);
                    }
                });
            } else {
                if (!targetUrl) {
                    location.reload();
                } else {
                    core.ng.http.handleTargetUrl(targetUrl);
                }
            }
        },

        handleResponse: function (response, defer) {
            var originalData = response.data;

            if (originalData.success === true) {
                response.data = originalData.result;
                defer.resolve(response);

                if (originalData.targetUrl) {
                    core.ng.http.handleTargetUrl(originalData.targetUrl);
                }
            } else if (originalData.success === false) {
                var messagePromise = null;

                if (originalData.error) {
                    messagePromise = core.ng.http.showError(originalData.error);
                } else {
                    originalData.error = defaultError;
                }

                core.ng.http.logError(originalData.error);

                response.data = originalData.error;
                defer.reject(response);

                if (originalData.unAuthorizedRequest) {
                    core.ng.http.handleUnAuthorizedRequest(messagePromise, originalData.targetUrl);
                }
            }
                //not wrapped result
            else {
                defer.resolve(response);
            }
        }
    };

    var coreModule = angular.module('core', []);

    coreModule.config([
        '$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push(['$q', function ($q) {
                var reqCount = 0;
                return {

                    'request': function (config) {
                        var displaySpinner = true, spinnerElement = '', spinnerOptions = {};
                        if (endsWith(config.url, '.cshtml')) {
                            config.url = core.appPath + 'CoreAppView/Load?viewUrl=' + config.url + '&_t=' + core.pageLoadTime.getTime();
                        }
                        if (angular.isDefined(config.showSpinner)) {
                            displaySpinner = config.showSpinner;
                        }

                        if (!endsWith(config.url, '.html') && ++reqCount === 1 && displaySpinner) {
                            core.ui.setBusy(config.spinnerElement || '', config.spinnerOptions || {});
                        }
                        return config;
                    },

                    'response': function (response) {
                        if (!endsWith(response.config.url, '.html') && --reqCount === 0) {
                            core.ui.clearBusy(response.config.spinnerElement);
                        }

                        if (!response.config || !response.config.core || !response.data) {
                            return response;
                        }

                        var defer = $q.defer();

                        core.ng.http.handleResponse(response, defer);

                        return defer.promise;
                    },

                    'responseError': function (ngError) {
                        var error = {
                            message: ngError.data || core.ng.http.defaultError.message,
                            details: ngError.statusText || core.ng.http.defaultError.details,
                            responseError: true
                        };

                        if (--reqCount === 0) {
                            core.ui.clearBusy();
                        }

                        core.ng.http.showError(error);

                        core.ng.http.logError(error);

                        return $q.reject(ngError);
                    }

                };
            }]);
        }
    ]);

    function endsWith(str, suffix) {
        if (suffix.length > str.length) {
            return false;
        }

        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

})((core || (core = {})), (angular || undefined));
