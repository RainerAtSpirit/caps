define(function() {
    'use strict';

    var serviceUrl = '/_layouts/CorasWorksApps/CorasWorksApplicationService.ashx',
        settings = {
            url: serviceUrl,
            cache: true,
            dataType: 'json',
            type: 'POST'
        };

    return {
        settings: settings
    };
});