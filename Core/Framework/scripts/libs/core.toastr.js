var core = core || {};
(function () {

    if (!toastr) {
        return;
    }

    /* DEFAULTS *************************************************/

    toastr.options.positionClass = 'toast-top-center';
    toastr.options.preventDuplicates = false;

    /* NOTIFICATION *********************************************/

    var setPersistentOptions = function () {
        toastr.options.tapToDismiss = false;
        toastr.options.timeOut = 1000000;
        toastr.options.extendedTimeOut = 1000000;
        toastr.options.closeButton = true;
    };

    var setAutoDisapperOptions = function (options) {
        toastr.options.timeOut = (options && options.timeOut) || 5000;
        toastr.options.extendedTimeOut = (options && options.extendedTimeOut) || 5000;
        toastr.options.closeButton = (options && options.closeButton) || false;
    };

    var showNotification = function (type, message, title, options) {
        if (options && options.isPersistent) {
            setPersistentOptions();
        } else {
            setAutoDisapperOptions(options);
        }
        toastr[type](message, title, options);
    };

    core.notify.success = function (message, title, options) {
        showNotification('success', message, title, options);
    };

    core.notify.info = function (message, title, options) {
        showNotification('info', message, title, options);
    };

    core.notify.warn = function (message, title, options) {
        showNotification('warning', message, title, options);
    };

    core.notify.error = function (message, title, options) {
        showNotification('error', message, title, options);
    };

})();
