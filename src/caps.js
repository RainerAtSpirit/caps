/**
 * Caps main module that defines the public API
 */
define(['config', 'fn', 'ops/processBatchData'],
    function( config, fn, processBatchData ) {

    //Return public API
    return {
        VERSION: config.VERSION,
        settings: config.settings,
        fn: fn,
        processBatchData: processBatchData
    }
});