define(function( require ) {
        'use strict';

        var $ = require('jquery'),
            fn = require('fn/common'),
            validate = require('helper/validate'),
            defaults;

        defaults = {
            type: 'GET',
            data: {
                RequestType: 'GetActionDefinitions',
                OutputType: 'json',
                DetailLevels: 1
            }
        };

        /**
         *
         * @param options {object} getActionDefinitions configuration object
         * @param params {object} ajax settings overwriting defaults and options
         * @returns {*} promise
         */
        function getActionDefinitions ( options, params ) {
            options = options || {};

            var request;

            request = $.extend(true, {}, defaults, {
                data: {
                    SiteUrl: validate.getSiteUrl(options.siteUrl, 'getActionDefinitions'),
                    ListTitle: validate.getListTitle(options.listTitle)
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

        return getActionDefinitions;
    }
);