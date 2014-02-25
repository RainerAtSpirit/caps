/**
 * Caps main module that defines the public API
 */
define(function( require ) {
        'use strict';

        var $ = require('jquery'),
            version = '0.12.1',
            fn;

        // extend common methods with methods available at caps.fn namespace
        fn = $.extend({}, require('common'), {
            createBatchXML: require('processBatchData/createBatchXML'),
            convertFilter2Caml: require('getListItems/convertFilter2Caml'),
            Events: require('events/index')
        });

        // Loading ECMA 5 polyfills
        require('polyfills');

        // Return public API
        return  {
            version: version,
            app: require('app'),
            processBatchData: require('processBatchData/index'),
            getListItems: require('getListItems/index'),
            getListInfo: require('getListInfo/index'),
            fn: fn
        };
    }
);