define(function( require ) {
        'use strict';

        var fn = require('common'),
            convertFilter2Caml = require('./convertFilter2Caml');

        function convertCaml ( caml, model ) {
            model = model || {};

            var result = [], fields;

            // filter require options.model.fields
            if ( caml.filter && (!model || !fn.checkNested(model.fields)) ) {
                throw new Error('caps.getListItems({caml.filter}). Required param model.fields missing.');
            }

            result.push(getQuery(caml.sort, caml.filter, model.fields));

            result.push(getViewFields(caml.viewFields));

            result.push(getRowLimit(caml.rowLimit));

            result.push(getQueryOptions(caml.queryOptions));

            return result.join('');

        }

        return convertCaml;

        //Internal
        function getRowLimit ( rowLimit ) {
            var result = "";

            if ( rowLimit ) {
                result = fn.format('<RowLimit>{0}</RowLimit>',
                    rowLimit);
            }

            return result;
        }

        function getQuery ( sort, filter, fields ) {
            var result = [];
            result.push('<Query>');

            if ( sort ) {
                result.push(getOrderBy(sort));
            }

            if ( filter ) {
                result.push(convertFilter2Caml(filter, fields));
            }

            result.push('</Query>');

            return result.join('');

            function getOrderBy ( sort ) {
                var result = [];

                sort = $.isArray(sort) ? sort : [sort];

                result.push('<OrderBy>');

                $.each(sort, function( index, sortObj ) {
                    var sortDir = (sortObj.dir === 'asc');

                    result.push(fn.format('<FieldRef Name="{0}" Ascending="{1}"/>',
                        sortObj.field,
                        sortDir)
                    );
                });

                result.push('</OrderBy>');

                return result.join('');
            }

        }

        function getViewFields ( viewFields ) {
            var result = [];

            if ( !viewFields ) {
                return '';
            }

            viewFields = $.isArray(viewFields) ? viewFields : viewFields.split(',');

            result.push('<ViewFields>');

            $.each(viewFields, function( index, field ) {

                result.push(fn.format('<FieldRef Name="{0}" />',
                    field)
                );
            });

            result.push('</ViewFields>');

            return result.join('');
        }

        function getQueryOptions (queryOptions) {
            var result = [],
                settings,
                // http://msdn.microsoft.com/en-us/library/dd966064%28v=office.12%29.aspx
                defaults = {
                    DateInUtc: true,
                    IncludeMandatoryColumns: false,
                    ExpandUserField: false
                };

            settings = $.extend({}, defaults, queryOptions);

            result.push('<QueryOptions>');

            $.each(settings, function(prop, value){
                result.push(fn.format('<{0}>{1}</{0}>', prop, value));
            });


            //todo: Should paging support be build into caps?
            result.push('</QueryOptions>');

            return result.join('');
        }

    }
);

