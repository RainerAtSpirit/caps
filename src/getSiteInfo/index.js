define(function( require ) {
        'use strict';

        var fn = require('../fn/common'),
            validate = require('../helper/validate'),
            defaults;

        defaults = {
            type: 'GET',
            data: {
                RequestType: 'GetSiteInfo',
                OutputType: 'json'
            }
        };

        /**
         *
         * @param options {object} getSiteInfo configuration object
         * @param params {object} ajax settings overwriting defaults and options
         * @returns {*} promise
         */
        function getSiteInfo ( options, params ) {
            options = options || {};

            var request,
                data = {},
                optional = ['properties'];

            data = validate.addOptionalProperties(options, data, optional);

            request = $.extend(true, {}, defaults, {
                data:  data
            }, params);

            return fn.getPromise(request);
        }

        return getSiteInfo;
    }
);