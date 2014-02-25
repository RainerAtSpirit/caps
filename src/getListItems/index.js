define(function( require ) {
        'use strict';

        var $ = require('jquery'),
            fn = require('common'),
            validate = require('validate'),
            convert2Caml = require('./convert2Caml'),
            defaults;

        defaults = {
            type: 'GET',
            data: {
                RequestType: 'GetListItems',
                OutputType: 'json'
            }
        };

        /**
         *
         * @param options {object} getListItems configuration object
         * @param params {objects} ajax settings overwriting default and options
         * @returns {*} promise
         */
        function getListItems ( options, params ) {
            options = options || {};

            var data, request;

            data = {
                SiteUrl: validate.getSiteUrl(options.siteUrl, 'getListItems'),
                ListTitle: validate.getListTitle(options.listTitle, 'getListItems')
            };

            if ( options.caml ) {
                data.CAML = convert2Caml(options.caml, options.model);
            }

            request = $.extend(true, defaults, {
                data: data
            }, params);

            return fn.getPromise(request);

        }

        return getListItems;

    }
);