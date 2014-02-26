define(function( require ) {
    'use strict';

    var fn;

    // extend common methods with methods available at caps.fn namespace
    fn = $.extend({}, require('./common'), {
        createBatchXML: require('processBatchData/createBatchXML'),
        convert2Caml: require('getListItems/convert2Caml'),
        convertFilter2Caml: require('getListItems/convertFilter2Caml'),
        Events: require('./events')
    });

    return fn;
});