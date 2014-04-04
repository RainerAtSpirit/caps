define(function( require ) {
        'use strict';

        var fn = require('../fn/common'),
            validate = require('../helper/validate'),
            defaults;

        defaults = {
            type: 'GET',
            data: {
                RequestType: 'GetWebPartPageTemplates',
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

            var request;

            request = $.extend(true, {}, defaults, {
                data: {

                }
            }, params);

            return fn.getPromise(request);
        }

        return getWebPartPageTemplates;
    }
);