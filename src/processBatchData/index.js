define(function( require ) {
        'use strict';

        var $ = require('jquery'),
            fn = require('common'),
            createBatchXML = require('./createBatchXML'),
            L_Menu_BaseUrl = window.L_Menu_BaseUrl || null,
            defaults;

        defaults = {
            type: 'POST',
            data: {
                RequestType: 'ProcessBatchData',
                OutputType: 'json'
            }
        };

        function processBatchData ( options, params ) {
            var siteUrl, listTitle, batch, request;

            options = validOptions(options);

            siteUrl = validSiteUrl(options);

            listTitle = validListTitle(options);

            batch = createBatchXML(options);

            request = $.extend(true, defaults, params, {
                data: {
                    SiteUrl: siteUrl,
                    ListTitle: listTitle,
                    Batch: batch
                }
            });

            return fn.getPromise(request);
        }

        return processBatchData;

        function validOptions ( options ) {

            //Todo: check if passed in object has a supported format
            if ( !true ) {
                throw new Error('caps.processBatchData(). Invalid options');
            }

            return $.isArray(options) ? options : [options];
        }

        function validSiteUrl ( options ) {
            var baseUrl = L_Menu_BaseUrl ? L_Menu_BaseUrl : '',
                site = options[0].siteUrl ? options[0].siteUrl : baseUrl,
                path = site.replace(/^\/+|\/+$/g, '');

            if ( !path ) {
                throw new Error('caps.processBatchData(). Missing required "siteUrl" property and fallback method L_Menu_BaseUrl is undefined.');
            }

            return '%WebRoot%' + site;
        }

        function validListTitle ( options ) {
            var listTitle = '';

            listTitle = $.map(options,function( obj ) {
                return obj.listTitle;
            }).join(',');


            if ( !listTitle ) {
                throw new Error('caps.processBatchData(). Missing required "listTitle" property.');
            }

            return listTitle;
        }
    }
);