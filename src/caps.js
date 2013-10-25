/**
 * Caps main module that defines the public API
 */
define(function( require ) {
        'use strict';
        var config = require('config');

        //Return public API
        return {
            version: '0.2.0',
            settings: config.settings,
            fn: require('fn'),
            BatchRequest: require('BatchRequest/index'),
            ProcessBatchData: require('ProcessBatchData/index')
        };
    }
);