/**
 * Caps main module that defines the public API
 */
define(function( require ) {
        'use strict';
        var config = require('config'),
            fn = require('fn'),
            processBatchData = require('processBatchData/index'),
            version = '0.1.0';

        //Return public API
        return {
            version: version,
            settings: config.settings,
            fn: fn,
            processBatchData: processBatchData
        };
    }
);