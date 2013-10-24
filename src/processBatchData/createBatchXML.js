define(function( require ) {
        'use strict';
        var $ = require('jquery'),
            fn = require('fn'),
            ctor = function() {
            this.methods = "";
        };

        $.extend(ctor.prototype, {
            create: function createBatchXML ( json ) {
                var options = $.isArray(json) ? json : [json],
                    self = this,
                    i,
                    len = options.length;

                self.methods = '<Batch><ows:Batch OnError="Continue"  xmlns:ows="http://www.corasworks.net/2012/ows">';

                for ( i = 0; i < len; i++ ) {
                    self.processList(options[i]);
                }

                self.methods += '</ows:Batch></Batch>';

                return self.methods;
            },
            processList: function( list ) {
                var self = this,
                    batches = $.isArray(list.batch) ? list.batch : [list.batch],
                    i,
                    len = batches.length;

                for ( i = 0; i < len; i++ ) {
                    self.processItems(list.name, batches[i]);
                }

            },
            processItems: function( listName, batch ) {
                var self = this,
                    items = $.isArray(batch.items) ? batch.items : [batch.items],
                    i,
                    len = items.length,
                    typeMap = {
                        'create': 'New',
                        'update': 'Update',
                        'delete': 'Delete'
                    };

                for ( i = 0; i < len; i++ ) {
                    var item = items[i];
                    self.methods += fn.format(
                        '<Method ID="{methodId}">' +
                            '<SetList>%{list}%</SetList>' +
                            '<SetVar Name="Cmd">{cmd}</SetVar>',
                        {
                            methodId: (item.Id ? item.Id + ',' + typeMap[batch.method] : typeMap[batch.method]) +
                                ',' + listName,
                            list: listName,
                            cmd: batch === 'delete' ? 'Delete' : 'Save'
                        }
                    );
                    self.processProps(item);
                    self.methods += '</Method>';
                }
            },
            processProps: function( item ) {
                var self = this,
                    prop;

                self.methods += fn.format('<SetVar Name="ID">{itemId}</SetVar>',
                    {itemId: item.Id || 'New'});

                for ( prop in item ) {
                    if ( item.hasOwnProperty(prop) ) {
                        if ( prop !== 'Id' ) {
                            self.methods += fn.format(
                                '<SetVar Name="urn:schemas-microsoft-com:office:office#{0}"><![CDATA[{1}]]></SetVar>',
                                prop, item[prop]);
                        }
                    }
                }
            }
        });

        return ctor;
    }
);