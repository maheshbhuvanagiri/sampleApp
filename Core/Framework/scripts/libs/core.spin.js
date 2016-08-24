var core = core || {};
(function () {

    if (!$.fn.spin) {
        return;
    }

    core.libs = core.libs || {};

    core.libs.spinjs = {

        spinner_config: {
            lines: 11,
            length: 0,
            width: 10,
            radius: 20,
            corners: 1.0,
            trail: 60,
            speed: 1.2,
            blockUI: true
        },

        //Config for busy indicator in element's inner element that has '.core-busy-indicator' class.
        spinner_config_inner_busy_indicator: {
            lines: 11,
            length: 0,
            width: 4,
            radius: 7,
            corners: 1.0,
            trail: 60,
            speed: 1.2,
            blockUI: true
        }

    };

    core.ui.setBusy = function (elm, optionsOrPromise) {
        optionsOrPromise = optionsOrPromise || {};
        //Check if it's promise
        if (optionsOrPromise.always || optionsOrPromise['finally']) {
            optionsOrPromise = {
                promise: optionsOrPromise
            };
        }

        var options = $.extend({}, core.libs.spinjs.spinner_config, optionsOrPromise);

        if (!elm) {
            if (options.blockUI) {
                core.ui.block();
            }
            $('body').spin(options);
        } else {
            var $elm = $(elm);
            //What if  more than one element. What if there are nested elements?
            var $busyIndicator = $elm.find('.core-busy-indicator');
            if ($busyIndicator.length) {
                $busyIndicator.spin($.extend({}, core.libs.spinjs.spinner_config_inner_busy_indicator, optionsOrPromise));
            } else {
                if (options.blockUI) {
                    core.ui.block(elm);
                }
                $elm.spin(options);
            }
        }
        //Supports Q and jQuery.Deferred
        if (options.promise) {
            if (options.promise.always) {
                options.promise.always(function () {
                    core.ui.clearBusy(elm);
                });
            } else if (options.promise['finally']) {
                options.promise['finally'](function () {
                    core.ui.clearBusy(elm);
                });
            }
        };
    };

    core.ui.clearBusy = function (elm) {
        //Maybe better to do not call unblock if it's not blocked by setBusy
        if (!elm) {
            core.ui.unblock();
            $('body').spin(false);
        } else {
            var $elm = $(elm);
            var $busyIndicator = $elm.find('.core-busy-indicator');
            if ($busyIndicator.length) {
                $busyIndicator.spin(false);
            } else {
                core.ui.unblock(elm);
                $elm.spin(false);
            }
        }
    };

})();
