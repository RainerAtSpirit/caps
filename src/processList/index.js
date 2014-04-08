define(function( require ) {
        'use strict';

        var capsParams = require('../capsParams'),
            fn = require('../fn/common'),
            validate = require('../helper/validate'),
            method = capsParams.processList,
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
         * @param options {object} processList configuration object
         * @param params {object} ajax settings overwriting defaults and options
         * @returns {*} promise
         */
        function processList ( options, params ) {
            options = options || {};

            var request,
                data = {},
                optional = method.optional,
                required = method.required;

            data = validate.addRequiredProperties(options, data, required, 'processList');
            data = validate.addOptionalProperties(options, data, optional);

            request = $.extend(true, {}, defaults, {
                data: data
            }, params);

            return fn.getPromise(request);
        }

        return processList;
    }
);