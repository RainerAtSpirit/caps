/**
 * Caps main module that defines the public API
 */
define(function( require ) {
        'use strict';
        var $ = require('jquery'),
            common = require('common'),
            version = '0.9.3',
            fn;

        // fn mixIns to common methods
        fn = mixIn({
            createBatchXML: function createBatchXML ( options ) {
                var batchXML = require('processBatchData/createBatchXML');
                return  batchXML.create(options);
            },
            convertFilter2Caml: require('getListItems/convertFilter2Caml')
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

        //Internal
        function mixIn ( obj ) {
            return $.extend({}, common, obj);
        }
    }
);