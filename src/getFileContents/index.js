define(function( require ) {
        'use strict';

        var capsParams = require('../capsParams'),
            fn = require('../fn/common'),
            validate = require('../helper/validate'),
            defaults;

        defaults = {
            type: 'GET',
            data: {
                RequestType: 'GetFileContents',
                OutputType: 'json'
            }
        };

        /**
         *
         * @param options {object} getFileContents configuration object
         * @param params {object} ajax settings overwriting defaults and options
         * @returns {*} promise
         */
        function getFileContents ( options, params ) {
            options = options || {};

            var request, data,
                optional = capsParams.getFileContents.optional;

            // Adding required properties
            data = {
                FileUrl: validate.getRequiredParam('fileUrl', options.fileUrl, 'getFileContents')
            };

            data = validate.addOptionalProperties(options, data, optional);

            request = $.extend(true, {}, defaults, {
                data: data
            }, params);


            return fn.getPromise(request);
        }

        return getFileContents;
    }
);