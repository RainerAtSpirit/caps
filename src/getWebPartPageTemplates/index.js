define(function( require ) {
        'use strict';

        var capsParams = require('../capsParams'),
            fn = require('../fn/common'),
            validate = require('../helper/validate'),
            method = capsParams.getWebPartPageTemplates,
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
         * @param options {object} getWebPartPageTemplates configuration object
         * @param params {object} ajax settings overwriting defaults and options
         * @returns {*} promise
         */
        function getWebPartPageTemplates ( options, params ) {
            options = options || {};

            var request,
                data = {},
                optional = method.optional,
                required = method.required;

            data = validate.addRequiredProperties(options, data, required, 'getWebPartPageTemplates');
            data = validate.addOptionalProperties(options, data, optional, 'getWebPartPageTemplates');

            request = $.extend(true, {}, defaults, {
                data: data
            }, params);

            return fn.getPromise(request);
        }

        return getWebPartPageTemplates;
    }
);