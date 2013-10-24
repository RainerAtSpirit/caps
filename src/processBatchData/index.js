define(function( require ) {
        'use strict';

        var $ = require('jquery'),
            config = require('config'),
            CreateBatchXML = require('./createBatchXML'),
            batchXML = new CreateBatchXML();

        function createBatchXML ( options ) {
            return batchXML.create(options);
        }

        function makeRequest ( options, params ) {
            options = $.isArray(options) ? options : [options];
            var site = options[0].site,
                request = $.extend(true, {}, config.settings, {
                    data: {
                        RequestType: "ProcessBatchData",
                        SiteUrl: '%WebRoot%/' + site,
                        ListTitle: $.map(options,function( obj ) {
                            return obj.name;
                        }).join(','),
                        OutputType: 'json',
                        Batch: batchXML.create(options)
                    }
                }, params);

            return $.ajax(request);
        }

        return {
            createBatchXML: createBatchXML,
            makeRequest: makeRequest
        };
    }
);