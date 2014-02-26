define(function( require ) {
        'use strict';
        var $ = require('jquery'),
            fn = require('fn/common');


        function createBatchXML ( options ) {
                options = $.isArray(options) ? options : [options];

                var i,
                len = options.length,
                methods = "";

            methods = '<Batch><ows:Batch OnError="Continue"  xmlns:ows="http://www.corasworks.net/2012/ows">';

            for ( i = 0; i < len; i++ ) {
                processList(options[i]);
            }

            methods += '</ows:Batch></Batch>';

            return methods;

            function processList ( list ) {
                var batches = $.isArray(list.batch) ? list.batch : [list.batch],
                    i,
                    len = batches.length;

                for ( i = 0; i < len; i++ ) {
                    processItems(list.name, batches[i]);
                }

            }

            function processItems ( listName, batch ) {
                var items = $.isArray(batch.items) ? batch.items : [batch.items],
                    i,
                    len = items.length,
                    typeMap = {
                        'create': 'New',
                        'update': 'Update',
                        'delete': 'Delete'
                    };

                for ( i = 0; i < len; i++ ) {
                    var item = items[i];
                    methods += fn.format(
                        '<Method ID="{methodId}">' +
                            '<SetList>%{list}%</SetList>' +
                            '<SetVar Name="Cmd">{cmd}</SetVar>',
                        {
                            methodId: (item.Id ? item.Id + ',' + typeMap[batch.method] : typeMap[batch.method]) +
                                ',' + listName,
                            list: listName,
                            cmd: batch.method === 'delete' ? 'Delete' : 'Save'
                        }
                    );
                    processProps(item);
                    methods += '</Method>';
                }
            }

            function processProps ( item ) {
                var prop;

                methods += fn.format('<SetVar Name="ID">{itemId}</SetVar>',
                    {itemId: item.Id || 'New'});

                for ( prop in item ) {
                    if ( item.hasOwnProperty(prop) ) {
                        if ( prop !== 'Id' ) {
                            methods += fn.format(
                                '<SetVar Name="urn:schemas-microsoft-com:office:office#{0}"><![CDATA[{1}]]></SetVar>',
                                prop, item[prop]);
                        }
                    }
                }
            }

        }

        return createBatchXML;
    }
);