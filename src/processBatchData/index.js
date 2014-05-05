define(function( require ) {
        'use strict';

        var capsParams = require('../capsParams'),
            fn = require('../fn/common'),
            validate = require('../helper/validate'),
            createBatchXML = require('./createBatchXML'),
            method = capsParams.processBatchData,
            defaults;

        defaults = {
            type: 'POST',
            data: {
                RequestType: method.name,
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

            var request,
                data = {},
                optional = method.optional,
                required = method.required;

            // Bypass check if options is an Array
            if (!$.isArray(options)){
                data = validate.addRequiredProperties(options, data, required, 'processBatchData');
                data = validate.addOptionalProperties(options, data, optional, 'processBatchData');
            }

            if ( $.isArray(options) || typeof data.Batch !== 'string' ) {
                data.Batch = createBatchXML(options);
                data.ListTitle = getListTitle(options);
            }

            request = $.extend(true, {}, defaults, {
                data: data
            }, params);

            return fn.getPromise(request);
        }

        return processBatchData;

        //Internal
        function getListTitle ( options ) {
            options = $.isArray(options) ? options : [options];

            var listTitle = '';

            listTitle = $.map(options,function( obj ) {
                return obj.listTitle;
            }).join(',');

            if ( !listTitle ) {
                throw new Error('caps.processBatchData(). Missing required "listTitle" property.');
            }

            return listTitle;
        }

    }
);