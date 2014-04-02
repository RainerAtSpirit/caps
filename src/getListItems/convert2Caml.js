define(function( require ) {
        'use strict';

        var fn = require('../fn/common'),
            convertFilter2Caml = require('./convertFilter2Caml');

        /**
         *
         * @param caml {object} caml configuration
         * @param model {object} model object required by caml.filter
         * @returns {string}
         */
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

                sort = typeof sort === 'string' ? JSON.parse(sort) : sort;

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
                    $.trim(field))
                );
            });

            result.push('</ViewFields>');

            return result.join('');
        }

        function getQueryOptions ( queryOptions ) {
            var result = [],
                settings,
                defaults;

            // Todo: Add getter/setter
            // http://msdn.microsoft.com/en-us/library/dd966064%28v=office.12%29.aspx
            defaults = {
                /*     DateInUtc: null,
                 Folder: null,
                 Paging: null,
                 IncludeMandatoryColumns: null,
                 MeetingInstanceID: null,
                 ViewAttributes: null,
                 RecurrencePatternXMLVersion: null,
                 RecurrenceOrderBy: null,
                 IncludePermissions: null,
                 ExpandUserField: null,
                 IncludeAttachmentUrls: null,
                 IncludeAttachmentVersion: null,
                 RemoveInvalidXmlCharacters: null,
                 OptimizeFor: null,
                 ExtraIds: null,
                 OptimizeLookups: null*/
            };

            settings = $.extend({}, defaults, queryOptions);

            result.push('<QueryOptions>');

            $.each(settings, function( prop, value ) {

                if ( prop === 'Paging' ) {

                    // Checking if "&" replacement was already applied

                    if ( value.indexOf('&amp;amp;') === -1 ) {
                        value = value.replace(/&/g, '&amp;amp;');
                    }

                    //value = encodeURIComponent(value);

                    result.push(fn.format('<{0} ListItemCollectionPositionNext="{1}"/>', prop, value));

                    return;
                }

                // Handling special case Document libraries
                // http://msdn.microsoft.com/en-us/library/lists.lists.getlistitems(v=office.12).aspx
                if ( prop === 'ViewAttributes' ) {

                    if (value.indexOf('Recursive') > -1 ){
                        result.push(fn.format('<{0} Scope="Recursive"/>', prop, value));
                    }

                    return;
                }

                result.push(fn.format('<{0}>{1}</{0}>', prop, value));

            });

            //todo: Should paging support be build into caps?
            result.push('</QueryOptions>');

            return result.join('');
        }

    }
);

