/**
 * Caps main module that defines the public API
 */
define(function( require ) {
        'use strict';

        var $ = require('jquery'),
            version = '0.16.1';

        // ECMA 5 polyfills
        require('helper/polyfills');

        // caps API
        return  {
            fn: require('fn/index'),
            version: version,
            getListInfo: require('getListInfo/index'),
            getListItems: require('getListItems/index'),
            processBatchData: require('processBatchData/index')
        };
    }
);