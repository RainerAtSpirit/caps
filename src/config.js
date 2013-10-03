define(function() {
    'use strict';

    var SERVICEURL = '/_layouts/CorasWorksApps/CorasWorksApplicationService.ashx',
        settings = {
            url: SERVICEURL,
            cache: true,
            dataType: 'json',
            type: 'POST'
        };

    return {
        settings: settings
    };
});