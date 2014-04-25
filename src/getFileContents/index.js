define(function( require ) {
        'use strict';

        var capsParams = require('../capsParams'),
            fn = require('../fn/common'),
            validate = require('../helper/validate'),
            method = capsParams.getFileContents,
            defaults;

        defaults = {
            type: 'GET',
            data: {
                                RequestType: method.name,
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

            var request,
                data = {},
                optional = method.optional,
                required = method.required;

            data = validate.addRequiredProperties(options, data, required, 'getFileContents');
            data = validate.addOptionalProperties(options, data, optional, 'getFileContents');

            request = $.extend(true, {}, defaults, {
                data: data
            }, params);

            return fn.getPromise(request);
        }

        return getFileContents;
    }
);