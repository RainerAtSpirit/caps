define(function() {
    'use strict';
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if ( !Object.keys ) {
        Object.keys = (function() {
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function( obj ) {
                if ( typeof obj !== 'object' && (typeof obj !== 'function' || obj === null) ) {
                    throw new TypeError('Object.keys called on non-object');
                }

                var result = [], prop, i;

                for ( prop in obj ) {
                    if ( hasOwnProperty.call(obj, prop) ) {
                        result.push(prop);
                    }
                }

                if ( hasDontEnumBug ) {
                    for ( i = 0; i < dontEnumsLength; i++ ) {
                        if ( hasOwnProperty.call(obj, dontEnums[i]) ) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }());
    }
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
    if ( !Array.prototype.lastIndexOf ) {
        Array.prototype.lastIndexOf = function( searchElement /*, fromIndex*/ ) {

            if ( this == null ) {
                throw new TypeError();
            }

            var n, k,
                t = Object(this),
                len = t.length >>> 0;
            if ( len === 0 ) {
                return -1;
            }

            n = len;
            if ( arguments.length > 1 ) {
                n = Number(arguments[1]);
                if ( n != n ) {
                    n = 0;
                }
                else if ( n != 0 && n != (1 / 0) && n != -(1 / 0) ) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }

            for ( k = n >= 0
                ? Math.min(n, len - 1)
                : len - Math.abs(n); k >= 0; k-- ) {
                if ( k in t && t[k] === searchElement ) {
                    return k;
                }
            }
            return -1;
        };
    }
});