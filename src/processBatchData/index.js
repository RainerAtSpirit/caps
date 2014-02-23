define(function( require ) {
        'use strict';

        var $ = require('jquery'),
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

        function ProcessBatchData ( options , params) {
            var siteUrl, listTitle, batch, request;

            options = isValidOption(options);

            siteUrl = isValidSite(options);

            batch = createBatchXML.create(options);

            listTitle = $.map(options,function( obj ) {
                return obj.name;
            }).join(',');

            request = $.extend(true, defaults, params, {
                data: {
                    SiteUrl: siteUrl,
                    ListTitle: listTitle,
                    Batch: batch
                }
            });

            return this.getPromise(request);
        }


        return ProcessBatchData;



        function isValidOption ( options ) {

            //Todo: check if passed in object has a supported format
            if ( !true ) {
                throw new Error('caps.processBatchData(). Invalid options');
            }

            return $.isArray(options) ? options : [options];
        }

        function isValidSite ( options ) {
            var baseUrl = L_Menu_BaseUrl ? L_Menu_BaseUrl : '',
                site = options[0].site ? options[0].site : baseUrl,
                path = site.replace(/^\/+|\/+$/g, '');

            if ( !path ) {
                throw new Error('caps.processBatchData(). Missing required site property and fallback method L_Menu_BaseUrl is undefined.');
            }

            return '%WebRoot%' + site;
        }
    }
);