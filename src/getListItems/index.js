define(function( require ) {
        'use strict';

        var $ = require('jquery'),
            cn = require('common'),
            convertFilter2Caml = require('./convertFilter2Caml'),
            L_Menu_BaseUrl = window.L_Menu_BaseUrl || null,
            defaults;

        defaults = {
            type: 'GET',
            data: {
                RequestType: 'GetListItems',
                OutputType: 'json'
            }
        };

        function getListItems ( options, params ) {
            var siteUrl, listTitle, data, request;

            options = validOptions(options);

            //Mandatory data properties
            data = {
                SiteUrl: validSiteUrl(options),
                ListTitle: validListTitle(options)
            };

            //todo: what about sort, paging, query options?
            if ( options.caml ) {
                data.CAML = validCaml(options);
            }

            request = $.extend(true, defaults, params, {
                data: data
            });

            return cn.getPromise(request);

        }

        return getListItems;

        function validOptions ( options ) {

            //Todo: check if passed in object has a supported format

            if ( !true ) {
                throw new Error('caps.getListItems(). Invalid options');
            }

            return options || {};
        }

        function validSiteUrl ( options ) {
            var baseUrl = L_Menu_BaseUrl ? L_Menu_BaseUrl : '',
                site = options.siteUrl ? options.siteUrl : baseUrl,
                path = site.replace(/^\/+|\/+$/g, '');

            if ( !path ) {
                throw new Error('caps.getListItems(). Missing required site property and fallback method L_Menu_BaseUrl is undefined.');
            }

            return '%WebRoot%/' + path;
        }

        function validListTitle ( options ) {

            if ( !options.listTitle ) {
                throw new Error('caps.getListItems(). Missing required title property');
            }

            return options.listTitle;
        }

        function validCaml ( options ) {
            var result = [],
                sortDir = true,
                PID = '',
                camlObj = options.caml;


            // filter require options.model.fields
            if ( camlObj.filter && !cn.checkNested(options.model.fields) ) {
                throw new Error('caps.getListItems({caml.filter: obj}). Missing required model.fields property.');
            }

            result.push('<Query>');

            if ( camlObj.sort ) {
                result.push(sortQuery(camlObj));
            }

            if ( camlObj.filter ) {
                var obj = {
                    filter: camlObj.filter,
                    fields: options.model.fields
                };

                result.push(convertFilter2Caml(obj));
            }

            result.push('</Query>');

//            if ( camlObj.pageSize ) {
//                   result.push(cn.format('<RowLimit>{0}</RowLimit>',
//                       camlObj.pageSize));
//            }


            result.push(queryOptions(camlObj));

            return result.join('');

            //Internal

            function sortQuery ( camlObj ) {
                var sort = [];

                camlObj.sort = $.isArray(camlObj.sort) ? camlObj.sort : [camlObj.sort];

                sort.push('<OrderBy>');

                $.each(camlObj.sort, function( index, sortObj ) {
                    sortDir = (sortObj.dir === 'asc');

                    sort.push(cn.format('<FieldRef Name="{0}" Ascending="{1}"/>',
                        sortObj.field,
                        sortDir)
                    );
                });

                sort.push('</OrderBy>');

                return sort.join('');
            }

            function queryOptions (camlObj) {
                var query = [];


                //todo: QueryOption JSON format?
                query.push('<QueryOptions>');
                query.push('<DateInUtc>True</DateInUtc>');
                query.push('<ExpandUserField>True</ExpandUserField>');

                //todo: Should paging support be build into caps?
                query.push('</QueryOptions>');


                return query.join('');
            }

        }

    }
);