var core = core || {};
(function ($) {

    //Check if SignalR is defined
    if (!$ || !$.connection) {
        return;
    }

    //Create namespaces
    core.signalr = core.signalr || {};
    core.signalr.hubs = core.signalr.hubs || {};

    //Get the common hub
    core.signalr.hubs.common = $.connection.coreCommonHub;

    var commonHub = core.signalr.hubs.common;
    if (!commonHub) {
        return;
    }

    //Register to get notifications
    commonHub.client.getNotification = function (notification) {
        core.event.trigger('core.notifications.received', notification);
    };

    //Connect to the server
    core.signalr.connect = function() {
        $.connection.hub.start().done(function () {
            //Remove log
            core.log.debug('Connected to SignalR server!');
            core.event.trigger('core.signalr.connected');
            commonHub.server.register().done(function () {
                // Remove log
                core.log.debug('Registered to the SignalR server!');
            });
        });
    };

    if (core.signalr.autoConnect === undefined) {
        core.signalr.autoConnect = true;
    }

    if (core.signalr.autoConnect) {
        core.signalr.connect();
    }

})(jQuery);
