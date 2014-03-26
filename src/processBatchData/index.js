define(function( require ) {
        'use strict';

        var fn = require('../fn/common'),
            validate = require('../helper/validate'),
            createBatchXML = require('./createBatchXML'),
            defaults;

        defaults = {
            type: 'POST',
            data: {
                RequestType: 'ProcessBatchData',
                OutputType: 'json'
            }
        };

        /**
         *
         * @param options {object} processBatchData configuration object
         * @param params {object} ajax settings overwriting defaults and options
         * @returns {*} promise
         */
        function processBatchData ( options, params ) {
            options = options || {};

            var siteUrl, listTitle, batch, request;

            siteUrl = validate.getSiteUrl(options.siteUrl, 'processBatchData');

            listTitle = getListTitle(options);

            batch = createBatchXML(validateBatch(options));

            request = $.extend(true, {}, defaults, {
                data: {
                    SiteUrl: siteUrl,
                    ListTitle: listTitle,
                    Batch: batch
                }
            }, params);

            return fn.getPromise(request);
        }

        return processBatchData;

        //Internal
        function getListTitle ( options ) {
            var listTitle = '';

            listTitle = $.map(options,function( obj ) {
                return obj.listTitle;
            }).join(',');

            if ( !listTitle ) {
                throw new Error('caps.processBatchData(). Missing required "listTitle" property.');
            }

            return listTitle;
        }

        function validateBatch ( options ) {

            if ( !options && !options.batch ) {
                throw new Error('caps.processBatchData(). Missing required "batch" property.');
            }

            return options.batch;
        }
    }
);