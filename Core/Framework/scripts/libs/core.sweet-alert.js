var core = core || {};
(function ($) {
    if (!sweetAlert || !$) {
        return;
    }

    /* DEFAULTS *************************************************/

    core.libs = core.libs || {};
    core.libs.sweetAlert = {
        config: {
            'default': {
            },
            info: {
                type: 'info'
            },
            success: {
                type: 'success'
            },
            warn: {
                type: 'warning'
            },
            error: {
                type: 'error'
            },
            confirm: {
                type: 'warning',
                title: 'Are you sure?',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes'
            }
        }
    };

    /* MESSAGE **************************************************/

    var showMessage = function (type, message, title) {
        if (!title) {
            title = message;
            message = null;
        }

        var opts = $.extend(
            {},
            core.libs.sweetAlert.config.default,
            core.libs.sweetAlert.config[type],
            {
                title: title,
                text: message
            }
        );

        return $.Deferred(function ($dfd) {
            sweetAlert(opts, function () {
                $dfd.resolve();
            });
        });
    };

    core.message.info = function (message, title) {
        return showMessage('info', message, title);
    };

    core.message.success = function (message, title) {
        return showMessage('success', message, title);
    };

    core.message.warn = function (message, title) {
        return showMessage('warn', message, title);
    };

    core.message.error = function (message, title) {
        return showMessage('error', message, title);
    };

    core.message.confirm = function (message, titleOrCallback, callback) {
        var userOpts = {
            text: message
        };

        if ($.isFunction(titleOrCallback)) {
            callback = titleOrCallback;
        } else if (titleOrCallback) {
            userOpts.title = titleOrCallback;
        };
        var opts = $.extend(
            {},
            core.libs.sweetAlert.config.default,
            core.libs.sweetAlert.config.confirm,
            userOpts
        );

        return $.Deferred(function ($dfd) {
            sweetAlert(opts, function (isConfirmed) {
                callback && callback(isConfirmed);
                $dfd.resolve(isConfirmed);
            });
        });
    };

    core.event.on('core.dynamicScriptsInitialized', function () {
        core.libs.sweetAlert.config.confirm.title = core.localization.coreWeb('AreYouSure');
        core.libs.sweetAlert.config.confirm.cancelButtonText = core.localization.coreWeb('Cancel');
        core.libs.sweetAlert.config.confirm.confirmButtonText = core.localization.coreWeb('Yes');
    });
})(jQuery);
