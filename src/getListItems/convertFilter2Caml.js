define(function( require ) {
        'use strict';
        var $ = require('jquery'),
            fn = require('common'),
            instance,
            camlMap = {
                'eq': 'Eq',
                'neq': 'Neq',
                'lt': 'Lt',
                'lte': 'Leq',
                'gt': 'Gt',
                'gte': 'Geq',
                'startswith': 'BeginsWith',
                'contains': 'Contains'
            },
            logicMap = {
                'and': 'And',
                'or': 'Or',
                'And': 'And',
                'Or': 'Or'
            },
            groupMap = {
                'Or': 'Or Group="true"',
                'And': 'And Group="true"'
            };

        function convertFilter2Caml ( options ) {
            options = options || {};

            var filter = [],
                fields = options.fields,
                oFilter = options.filter,
                caml = [];

            filter.push('<Where>');

            if ( oFilter && oFilter.filters.length === 1 && oFilter.filters[0].field ) {
                filter.push(createExpression(oFilter.filters[0]));
            }
            else {
                convertBinarySearchTree2Caml(options.filter);
                filter.push(caml.join(''));
            }
            filter.push('</Where>');

            return (filter.join(''));

            // Internal
            function convertBinarySearchTree2Caml ( filter, filterID ) {
                var fID = '',
                    rfilters = filter.filters,
                    logic = logicMap[filter.logic || 'And'],
                    groupID;

                groupID = (typeof filterID !== 'undefined') ? parseInt(filterID.substring(filterID.lastIndexOf('.') + 1), 10) : 0;

                if ( groupID > 0 && groupID % 2 === 0 ) {
                    caml.unshift(caml[0]);
                    caml.push(caml[0].replace('<', '</'));
                }
                caml.push(fn.format('<{0}>', (typeof filterID !== 'undefined') ? groupMap[logic] : logic));

                $.each(rfilters, function( idx, currFilter ) {

                    fID = filterID ? filterID + '.' + idx.toString() : idx.toString();

                    if ( typeof currFilter.logic !== 'undefined' ) {
                        convertBinarySearchTree2Caml(currFilter, fID);
                    }
                    else {
                        if ( idx > 1 ) {
                            var insertIdx = caml.lastIndexOf('<' + groupMap[logic] + '>') + 1;

                            if ( insertIdx === -1 ) {
                                caml.unshift(fn.format('<{0}>', logic));
                            }
                            else {
                                caml.splice(insertIdx, 0, fn.format('<{0}>', logic));
                            }

                            caml.push(fn.format('</{0}>', logic));
                        }
                        caml.push(createExpression(currFilter));
                    }
                });

                caml.push(fn.format('</{0}>', logic));
            }

            function createExpression ( filterObj ) {
                filterObj = $.isArray(filterObj) ? filterObj[0] : filterObj;
                var filterExpr = "<{0}><FieldRef Name='{1}' /><Value Type='{2}'>{3}</Value></{0}>",
                    val = filterObj.value,
                    operator = camlMap[filterObj.operator],
                    field = filterObj.field,
                    type = fields[filterObj.field].type;

                return fn.format(filterExpr, operator, field, type, val);
            }

        }

        return convertFilter2Caml;

    }
);

