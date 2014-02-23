define(function( require ) {
        'use strict';

        var $ = require('jquery'),
            L_Menu_BaseUrl = window.L_Menu_BaseUrl || null,
            defaults;

        defaults = {
            type: 'GET',
            data: {
                RequestType: 'GetListItems',
                OutputType: 'json'
            }
        };

        function GetListItems ( options, params ) {
            var siteUrl, listTitle, request;

            options = isValidOption(options);
            siteUrl = isValidSiteUrl(options);
            listTitle = isValidListTitle(options);

            request = $.extend(true, defaults, params, {
                data: {
                    SiteUrl: siteUrl,
                    ListTitle: listTitle
                }
            });

            return this.getPromise(request);

        }

        return GetListItems;


        function isValidOption ( options ) {

            //Todo: check if passed in object has a supported format

            if ( !true ) {
                throw new Error('caps.getListItems(). Invalid options');
            }

            return options || {};
        }

        function isValidSiteUrl ( options ) {
            var baseUrl = L_Menu_BaseUrl ? L_Menu_BaseUrl : '',
                site = options.siteUrl ? options.siteUrl : baseUrl,
                path = site.replace(/^\/+|\/+$/g, '');

            if ( !path ) {
                throw new Error('caps.getListItems(). Missing required site property and fallback method L_Menu_BaseUrl is undefined.');
            }

            return '%WebRoot%/' + path;
        }

        function isValidListTitle ( options ) {

            if ( !options.listTitle ) {
                throw new Error('caps.getListItems(). Missing required title property');
            }

            return options.listTitle;
        }
    }
);