define(function( require ) {
        'use strict';

        var fn = require('../fn/common'),
            validate = require('../helper/validate'),
            defaults;

        defaults = {
            type: 'GET',
            data: {
                RequestType: 'GetListInfo',
                OutputType: 'json'
            }
        };

        /**
         *
         * @param options {object} getListInfo configuration object
         * @param params {object} ajax settings overwriting defaults and options
         * @returns {*} promise
         */
        function getListInfo ( options, params ) {
            options = options || {};

            var request, data,
                optional = ['listTitle', 'properties'];

            // Adding mandatory properties
            data = {
                SiteUrl: validate.getSiteUrl(options.siteUrl, 'getListInfo')
            };

            data = validate.addOptionalProperties(options, data, optional);

            request = $.extend(true, {}, defaults, {
                data: data
            }, params);


            return fn.getPromise(request);
        }

        return getListInfo;
    }
);