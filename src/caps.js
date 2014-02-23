/**
 * Caps main module that defines the public API
 */
define(function( require ) {
        'use strict';
        var version = '0.3.1',
            config = require('config'),
            common = require('common'),
            batchRequest = require('batchRequest/index'),
            processBatchData = require('processBatchData/index'),
            Caps, deprecated;

        Caps = function() {
            this.version = version;
            this.settings = config.settings;
            this.batchRequest = batchRequest;
            this.processBatchData = processBatchData;
        };

        //Todo: Check with Michael if this could be removed in 1.x.x
        deprecated = {
            ProcessBatchData : processBatchData,
            BatchRequest: batchRequest
        };

        $.extend(true, Caps.prototype, common, deprecated);


        //Return public API
        return new Caps();
    }
);