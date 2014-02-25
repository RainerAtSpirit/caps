/**
 * Caps main module that defines the public API
 */
define(function( require ) {
        'use strict';

        var $ = require('jquery'),
            version = '0.14.1',
            fn;

        // extend common methods with methods available at caps.fn namespace
        fn = $.extend({}, require('common'), {
            createBatchXML: require('processBatchData/createBatchXML'),
            convert2Caml: require('getListItems/convert2Caml'),
            convertFilter2Caml: require('getListItems/convertFilter2Caml'),
            Events: require('events/index')
        });

        // Loading ECMA 5 polyfills
        require('polyfills');

        // Return public API
        return  {
            version: version,
            processBatchData: require('processBatchData/index'),
            getListItems: require('getListItems/index'),
            getListInfo: require('getListInfo/index'),
            fn: fn
        };
    }
);