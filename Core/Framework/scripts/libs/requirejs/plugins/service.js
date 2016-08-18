define(function () {
    return {
        load: function (name, req, onload, config) {
            var url = core.appPath + 'api/ExtServiceProxies/Get?name=' + name;
            req([url], function (value) {
                onload(value);
            });
        }
    };
});
