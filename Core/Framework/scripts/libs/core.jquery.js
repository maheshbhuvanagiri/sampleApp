var core = core || {};
(function ($) {

    if (!$) {
        return;
    }

    /* JQUERY ENHANCEMENTS ***************************************************/

    // core.ajax -> uses $.ajax ------------------------------------------------

    core.ajax = function (userOptions) {
        userOptions = userOptions || {};

        var options = $.extend({}, core.ajax.defaultOpts, userOptions);
        options.success = null;
        options.error = null;

        return $.Deferred(function ($dfd) {
            $.ajax(options)
                .done(function (data) {
                    core.ajax.handleResponse(data, userOptions, $dfd);
                }).fail(function () {
                    $dfd.reject.apply(this, arguments);
                });
        });
    };

    $.extend(core.ajax, {
        defaultOpts: {
            dataType: 'json',
            type: 'POST',
            contentType: 'application/json'
        },

        defaultError: {
            message: 'Ajax request did not succeed!',
            details: 'Error detail not sent by server.'
        },

        logError: function (error) {
            core.log.error(error);
        },

        showError: function (error) {
            if (error.details) {
                return core.message.error(error.details, error.message);
            } else {
                return core.message.error(error.message || core.ajax.defaultError.message);
            }
        },

        handleTargetUrl: function (targetUrl) {
            if (!targetUrl) {
                location.reload();
            } else {
                location.href = targetUrl;
            }
        },

        handleUnAuthorizedRequest: function (messagePromise, targetUrl) {
            if (messagePromise) {
                messagePromise.done(function () {
                    core.ajax.handleTargetUrl(targetUrl);
                });
            } else {
                core.ajax.handleTargetUrl(targetUrl);
            }
        },

        handleResponse: function (data, userOptions, $dfd) {
            if (data) {
                if (data.success === true) {
                    $dfd && $dfd.resolve(data.result, data);
                    userOptions.success && userOptions.success(data.result, data);

                    if (data.targetUrl) {
                        core.ajax.handleTargetUrl(data.targetUrl);
                    }
                } else if (data.success === false) {
                    var messagePromise = null;

                    if (data.error) {
                        messagePromise = core.ajax.showError(data.error);
                    } else {
                        data.error = core.ajax.defaultError;
                    }

                    core.ajax.logError(data.error);

                    $dfd && $dfd.reject(data.error);
                    userOptions.error && userOptions.error(data.error);

                    if (data.unAuthorizedRequest) {
                        core.ajax.handleUnAuthorizedRequest(messagePromise, data.targetUrl);
                    }
                }
                 //not wrapped result
                else {
                    $dfd && $dfd.resolve(data);
                    userOptions.success && userOptions.success(data);
                }
            }
            //no data sent to back
            else {
                $dfd && $dfd.resolve();
                userOptions.success && userOptions.success();
            }
        },

        blockUI: function (options) {
            if (options.blockUI) {
                //block whole page
                if (options.blockUI === true) {
                    core.ui.setBusy();
                }
                 //block an element
                else {
                    core.ui.setBusy(options.blockUI);
                }
            }
        },

        unblockUI: function (options) {
            if (options.blockUI) {
                //unblock whole page
                if (options.blockUI === true) {
                    core.ui.clearBusy();
                }
                    //unblock an element
                else {
                    core.ui.clearBusy(options.blockUI);
                }
            }
        }
    });

    /* JQUERY PLUGIN ENHANCEMENTS ********************************************/

    /* jQuery Form Plugin
     * http://www.malsup.com/jquery/form/
     */

    // coreAjaxForm -> uses ajaxForm ------------------------------------------

    if ($.fn.ajaxForm) {
        $.fn.coreAjaxForm = function (userOptions) {
            userOptions = userOptions || {};

            var options = $.extend({}, $.fn.coreAjaxForm.defaults, userOptions);

            options.beforeSubmit = function () {
                core.ajax.blockUI(options);
                userOptions.beforeSubmit && userOptions.beforeSubmit.apply(this, arguments);
            };

            options.success = function (data) {
                core.ajax.handleResponse(data, userOptions);
            };

            // Error?

            options.complete = function () {
                core.ajax.unblockUI(options);
                userOptions.complete && userOptions.complete.apply(this, arguments);
            };

            return this.ajaxForm(options);
        };

        $.fn.coreAjaxForm.defaults = {
            method: 'POST'
        };
    }

})(jQuery);
