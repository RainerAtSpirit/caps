define(function( require ) {
        'use strict';

        var $ = require('jquery'),
            fn = require('common'),
            validate = require('validate'),
            convertFilter2Caml = require('./convertFilter2Caml'),
            defaults;

        defaults = {
            type: 'GET',
            data: {
                RequestType: 'GetListItems',
                OutputType: 'json'
            }
        };

        /**
         *
         * @param options {object} getListItems configuration object
         * @param params {objects} ajax settings overwriting default and options
         * @returns {*} promise
         */
        function getListItems ( options, params ) {
            options = options || {};

            var data, request;

            data = {
                SiteUrl: validate.getSiteUrl(options.siteUrl, 'getListItems'),
                ListTitle: validate.getListTitle(options.listTitle, 'getListItems')
            };

            if ( options.caml ) {
                data.CAML = getCaml(options);
            }

            request = $.extend(true, defaults, {
                data: data
            }, params);

            return fn.getPromise(request);

        }

        return getListItems;


        // Internal
        function getCaml ( options ) {
            var result = [],
                sortDir = true,
                PID = '',
                camlObj = options.caml;


            // filter require options.model.fields
            if ( camlObj.filter && !fn.checkNested(options.model.fields) ) {
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

                    sort.push(fn.format('<FieldRef Name="{0}" Ascending="{1}"/>',
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