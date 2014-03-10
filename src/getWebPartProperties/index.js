define(function( require ) {
        'use strict';

        var $ = require('jquery'),
            fn = require('fn/common'),
            validate = require('helper/validate'),
            defaults;

        defaults = {
            type: 'GET',
            data: {
                RequestType: 'GetWebPartProperties',
                OutputType: 'json'
            }
        };

        /**
         *
         * @param options {object} getActionDefinitions configuration object
         * @param params {object} ajax settings overwriting defaults and options
         * @returns {*} promise
         */
        function getWebPartProperties ( options, params ) {
            options = options || {};

            var request;

            request = $.extend(true, defaults, {
                data: {

                }
            }, params);

            return fn.getPromise(request)
                .then(function( response ) {

                    // Advanced processing for json
                    if ( request.data.OutputType === 'json' ) {
                        return validate.processResponse(request, response);
                    }

                });
        }

        return getWebPartProperties;
    }
);