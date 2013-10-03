/**
 * Caps main module that defines the public API
 */
define(['config', 'fn', 'processBatchData/index'],
    function( config, fn, processBatchData ) {
        'use strict';

        var VERSION = '0.1.0';

        //Return public API
        return {
            VERSION: VERSION,
            settings: config.settings,
            fn: fn,
            processBatchData: processBatchData
        };
    }
);