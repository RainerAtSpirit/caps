/**
 * Caps main module that defines the public API
 */
define(function( require ) {
        'use strict';
        var version = '0.3.2',
            common = require('common'),
            batchRequest = require('batchRequest/index'),
            processBatchData = require('processBatchData/index'),
            Caps, deprecated, fn;

        Caps = function() {
            this.version = version;
            this.batchRequest = batchRequest;
            this.processBatchData = processBatchData;
        };

        //Todo: Check with Michael if this could be removed in 1.x.x
        deprecated = {
            ProcessBatchData: processBatchData,
            BatchRequest: batchRequest
        };

        /**
         * fn hosts helper function that we don't want to expose in the caps root namespace
         */
        fn = {
            fn: {
                createBatchXML: function createBatchXML ( options ) {
                    var batchXML = require('processBatchData/createBatchXML');
                    return  batchXML.create(options);
                }
            }
        };

        $.extend(true, Caps.prototype, common, fn, deprecated);

        //Return public API
        return new Caps();
    }
);