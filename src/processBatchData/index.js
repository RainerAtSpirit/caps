define(['jquery', 'config', './createBatchXML'],
    function( $, config, CreateBatchXML ) {
        'use strict';

        var batchXML = new CreateBatchXML();

        function createBatchXML ( options ) {
            return batchXML.create(options);
        }

        function makeRequest ( options, params ) {
            options = $.isArray(options) ? options : [options];
            var site = options[0].site,
                request = $.extend(true, {}, config.settings, {
                    data: {
                        RequestType: "ProcessBatchData",
                        // Todo:
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