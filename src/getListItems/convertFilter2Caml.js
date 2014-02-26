define(function( require ) {
        'use strict';
        var $ = require('jquery'),
            fn = require('fn/common'),
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

        function convertFilter2Caml ( filter, fields ) {
            var where = [],
                caml = [];

            if ( !filter ) {
                throw new Error('caps.convertFilter2Caml(). Missing required filter argument');
            }

            if ( !fields ) {
                throw new Error('caps.convertFilter2Caml(). Missing required fields argument');
             }
           
            where.push('<Where>');

            if ( filter && filter.filters.length === 1 && filter.filters[0].field ) {
                where.push(createExpression(filter.filters[0]));
            }
            else {
                convertBinarySearchTree2Caml(filter);
                where.push(caml.join(''));
            }
            where.push('</Where>');

            return (where.join(''));

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
                    type;

                // Check if we got a valid fields definition
                if ( !fields[filterObj.field] ) {
                    throw new Error(fn.format('caps.convertFilter2Caml(). Missing model.fields defintion for {0}', filterObj.field));
                }

                type = fields[filterObj.field].type;

                return fn.format(filterExpr, operator, field, type, val);
            }

        }

        return convertFilter2Caml;
    }
);

