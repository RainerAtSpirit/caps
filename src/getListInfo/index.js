define(function( require ) {
        'use strict';

        var $ = require('jquery'),
            fn = require('fn/common'),
            validate = require('helper/validate'),
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

            var request;

            request = $.extend(true, {},  defaults, {
                data: {
                    SiteUrl: validate.getSiteUrl(options.siteUrl, 'getListInfo'),
                    ListTitle: getListTitle(options)
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

        return getListInfo;

        // GetListInfo returns info for all lists if called without listTitle
        function getListTitle ( options ) {

            return options.listTitle || '';
        }
    }
);