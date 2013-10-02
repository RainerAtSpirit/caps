define(function() {

    var SERVICEURL = '/_layouts/CorasWorksApps/CorasWorksApplicationService.ashx';

    var VERSION = '0.1.0';

    var settings = {
        url: SERVICEURL,
        cache: true,
        dataType: 'json',
        type: 'POST'
    };

    return {
        VERSION: VERSION,
        settings: settings
    }
});