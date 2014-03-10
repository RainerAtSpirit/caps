/**
 * Caps main module that defines the public API
 */
define(function( require ) {
        'use strict';

        var $ = require('jquery'),
            Events = require('fn/events'),
            version = '0.17.1',
            caps;

        // ECMA 5 polyfills
        require('helper/polyfills');

        caps = {
            fn: require('fn/index'),
            version: version,
            getListInfo: require('getListInfo/index'),
            getListItems: require('getListItems/index'),
            processBatchData: require('processBatchData/index')
        };

        // Add events in caps name space
        Events.includeIn(caps);

        // caps API
        return  caps;
    }
);