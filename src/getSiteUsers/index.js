define(function( require ) {
        'use strict';

        var $ = require('jquery'),
            fn = require('fn/common'),
            validate = require('helper/validate'),
            defaults;

        defaults = {
            type: 'GET',
            data: {
                RequestType: 'GetSiteUser',
                OutputType: 'json'
            }
        };

        /**
         *
         * @param options {object} getActionDefinitions configuration object
         * @param params {object} ajax settings overwriting defaults and options
         * @returns {*} promise
         */
        function getSiteUsers ( options, params ) {
            options = options || {};

            var request;

            request = $.extend(true, {}, defaults, {
                data: {

                }
            }, params);

            return fn.getPromise(request);
        }

        return getSiteUsers;
    }
);