var core = core || {};
(function () {
    if (!moment || !moment.tz) {
        return;
    }

    /* DEFAULTS *************************************************/

    core.timing = core.timing || {};

    /* FUNCTIONS **************************************************/

    core.timing.convertToUserTimezone = function (date) {
        var momentDate = moment(date);
        var targetDate = momentDate.clone().tz(core.timing.timeZoneInfo.iana.timeZoneId);
        return targetDate;
    };

})();
