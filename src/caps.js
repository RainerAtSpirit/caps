/**
 * Caps main module that defines the public API
 */
define(function( require ) {
        'use strict';
        var $ = require('jquery'),
            common = require('common'),
            events = require('events'),
            version = '0.10.4',
            fn;

        // fn mixIns to common methods
        fn = mixIn({
            createBatchXML: require('processBatchData/createBatchXML'),
            convertFilter2Caml: require('getListItems/convertFilter2Caml'),

            //Including the Events constructor NOT the global events object
            Events:  require('events/index')
        });

        // Loading ECMA 5 polyfills
        require('polyfills');

        // Return public API
        return  {
            version: version,
            processBatchData: require('processBatchData/index'),
            getListItems: require('getListItems/index'),
            getListInfo: require('getListInfo/index'),
            fn: fn,
            events: events
        };

        //Internal
        function mixIn ( obj ) {
            return $.extend({}, common, obj);
        }
    }
);