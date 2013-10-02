define(['jquery', 'config', 'ops/pbd/createBatchXML'], function( $, config, CreateBatchXML ) {

    var batchXML = new CreateBatchXML();

    function createBatchXML (options){
      return batchXML.create(options);
    }

    function makeRequest ( options, params ) {
        options = $.isArray(options) ? options : [options];

        var request = $.extend(true, {}, config.settings, {
            data: {
                RequestType: "ProcessBatchData",
                // Todo:
                SiteUrl: '%WebRoot%/' + options[0].site,
                ListTitle: $.map(options,function( obj, id ) {
                    return obj.name
                }).join(','),
                OutputType: 'json',
                Batch: batchXML.create(options)
            }
        }, params);

        return $.ajax(request)
    }

    return {
        createBatchXML: createBatchXML,
        makeRequest: makeRequest
    };
});