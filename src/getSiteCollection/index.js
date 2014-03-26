define(function( require ) {
        'use strict';

        var fn = require('../fn/common'),
            validate = require('../helper/validate'),
            defaults;

        defaults = {
            type: 'GET',
            data: {
                RequestType: 'GetSiteCollection',
                OutputType: 'json'
            }
        };

        /**
         *
         * @param options {object} getActionDefinitions configuration object
         * @param params {object} ajax settings overwriting defaults and options
         * @returns {*} promise
         */
        function getSiteCollection ( options, params ) {
            options = options || {};

            var request;

            request = $.extend(true, {}, defaults, {
                data: {

                }
            }, params);

            return fn.getPromise(request);
        }

        return getSiteCollection;
    }
);