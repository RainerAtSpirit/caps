(function() {

    // Initial Setup
    // -------------

    // Save a reference to the global object
    var root = this;

    // Save the previous value of the `caps` variable, so that it can be
    // restored later on, if `noConflict` is used.
    var previousCaps = root.caps;

    // The top-level namespace. All public caps classes and modules will
    // be attached to this.
    var caps = root.caps = {};

    // Current version of the library.
    var VERSION = caps.VERSION = '0.1.0';

    // default caps endpoint
    var SERVICEURL = '/_layouts/CorasWorksApps/CorasWorksApplicationService.ashx';

    // Runs caps.js in *noConflict* mode, returning the `caps` variable
    // to its previous owner. Returns a reference to this caps object.
    caps.noConflict = function() {
        root.caps = previousCaps;
        return this;
    };

    // Default caps settings
    var settings = caps.settings = {
        url: SERVICEURL,
        cache: true,
        dataType: 'json',
        type: 'POST'
    };

    var fn = caps.fn = {
        checkNested: function( obj ) {
            var args = Array.prototype.slice.call(arguments);
            var obj = args.shift();

            for ( var i = 0; i < args.length; i++ ) {
                if ( !obj.hasOwnProperty(args[i]) ) {
                    return false;
                }
                obj = obj[args[i]];
            }
            return true;
        },
        format: function( str, col ) {
            col = typeof col === 'object' ? col : Array.prototype.slice.call(arguments, 1);

            return str.replace(/\{\{|\}\}|\{(\w+)\}/g, function( m, n ) {
                if ( m == "{{" ) {
                    return "{";
                }
                if ( m == "}}" ) {
                    return "}";
                }
                return col[n];
            });
        }
    };

    // creates a Batch XML that can be used in caps.processBatchData to create/update/delete multiple items in multiple
    // lists in a single site
    var createBatchMethod = caps.createBatchMethod = function createBatchMethod ( options ) {

        var ctor = function( options ) {
            options = $.isArray(options) ? options : [options];
            this.methods = "";

            return this.processOptions(options);
        };

        $.extend(ctor.prototype, {
            processOptions: function( options ) {
                var self = this;
                self.methods = '<Batch><ows:Batch OnError="Continue"  xmlns:ows="http://www.corasworks.net/2012/ows">';

                $.each(options, function( idx, list ) {
                    self.processList(list);
                });

                self.methods += '</ows:Batch></Batch>';
            },
            processList: function( list ) {
                var self = this;
                var batches = $.isArray(list.batch) ? list.batch : [list.batch];

                $.each(batches, function( mIdx, batch ) {
                    self.processItems(list.name, batch);
                });
            },
            processItems: function( listName, batch ) {
                var self = this;
                var items = $.isArray(batch.items) ? batch.items : [batch.items];
                var typeMap = {
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

        return new ctor(options).methods;

    };

    var processBatchData = caps.processBatchData = function processBatchData ( options, params ) {
        options = $.isArray(options) ? options : [options];

        var request = $.extend(true, {}, settings, {
            data: {
                RequestType: "ProcessBatchData",
                // Todo:
                SiteUrl: '%WebRoot%/' + options[0].site,
                ListTitle: $.map(options,function( obj, id ) {
                    return obj.name
                }).join(','),
                OutputType: 'json',
                Batch: this.createBatchMethod(options)
            }
        }, params);

        return $.ajax(request);
    };

}).call(this);

