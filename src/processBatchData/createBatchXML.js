define(['jquery', 'fn'],
    function( $, fn ) {
        'use strict';
        var ctor = function() {
            this.methods = "";
        };

        $.extend(ctor.prototype, {
            create: function createBatchXML ( json ) {
                var options = $.isArray(json) ? json : [json],
                    self = this;

                self.methods = '<Batch><ows:Batch OnError="Continue"  xmlns:ows="http://www.corasworks.net/2012/ows">';

                $.each(options, function( idx, list ) {
                    self.processList(list);
                });

                self.methods += '</ows:Batch></Batch>';

                return self.methods;
            },
            processList: function( list ) {
                var self = this,
                    batches = $.isArray(list.batch) ? list.batch : [list.batch];

                $.each(batches, function( mIdx, batch ) {
                    self.processItems(list.name, batch);
                });
            },
            processItems: function( listName, batch ) {
                var self = this,
                    items = $.isArray(batch.items) ? batch.items : [batch.items],
                    typeMap = {
                        'create': 'New',
                        'update': 'Update',
                        'delete': 'Delete'
                    };

                $.each(items, function( iIdx, item ) {
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
                });

            },
            processProps: function( item ) {
                var self = this;

                self.methods += fn.format('<SetVar Name="ID">{itemId}</SetVar>',
                    {itemId: item.Id || 'New'});

                $.each(item, function( prop, val ) {
                    if ( prop !== 'Id' ) {
                        self.methods += fn.format(
                            '<SetVar Name="urn:schemas-microsoft-com:office:office#{0}"><![CDATA[{1}]]></SetVar>',
                            prop, val);
                    }
                });
            }
        });

        return ctor;
    }
);