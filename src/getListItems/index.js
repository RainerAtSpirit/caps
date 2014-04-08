define(function( require ) {
        'use strict';

        var capsParams = require('../capsParams'),
            fn = require('../fn/common'),
            validate = require('../helper/validate'),
            convert2Caml = require('./convert2Caml'),
            method = capsParams.getListItems,
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
         * @param options {object} getListItems configuration object
         * @param params {objects} ajax settings overwriting defaults and options
         * @returns {*} promise
         */
        function getListItems ( options, params ) {
            options = options || {};

            var request,
                data = {},
                optional = method.optional,
                required = method.required;

            data = validate.addRequiredProperties(options, data, required, 'getListItems');
            data = validate.addOptionalProperties(options, data, optional);

            // Overwrite automatically created data.CAML with processed CAML
            if ( data.CAML ) {
                data.CAML = convert2Caml(options.caml, options.model);
            }


            request = $.extend(true, {}, defaults, {
                data: data
            }, params);

            return fn.getPromise(request);
        }

        return getListItems;
    }
);