define(function( require ) {
        'use strict';

        var $ = require('jquery'),
            fn = require('common'),
            validate = require('validate'),
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

            request = $.extend(true, defaults, {
                data: {
                    SiteUrl: validate.getSiteUrl(options.siteUrl, 'GetListInfo'),
                    ListTitle: getListTitle(options)
                }
            }, params);

            return fn.getPromise(request);
        }

        return getListInfo;


        // GetListInfo returns info for all lists if called without listTitle
        function getListTitle ( options ) {

            if ( !options.listTitle ) {
                return '';
            }

            return options.listTitle;
        }
    }
);