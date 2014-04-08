define(function( require ) {
        'use strict';

        var capsParams = require('../capsParams'),
            fn = require('../fn/common'),
            validate = require('../helper/validate'),
            defaults;

        defaults = {
            type: 'GET',
            data: {
                RequestType: 'GetContentTypes',
                OutputType: 'json'
            }
        };

        /**
         *
         * @param options {object} getContentTypes configuration object
         * @param params {object} ajax settings overwriting defaults and options
         * @returns {*} promise
         */
        function getContentTypes ( options, params ) {
            options = options || {};

            var request, data,
                optional = capsParams.getContentTypes.optional;

            // Adding required properties
            data = {

            };

            data = validate.addOptionalProperties(options, data, optional);

            request = $.extend(true, {}, defaults, {
                data: data
            }, params);


            return fn.getPromise(request);
        }

        return getContentTypes;
    }
);