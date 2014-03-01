define(function() {
    'use strict';

    /**
     * Check for existence of nested object keys
     * http://stackoverflow.com/questions/2631001/javascript-test-for-existence-of-nested-object-key
     *
     * @example
     * var test = {level1:{level2:{level3:'level3'}} };
     * checkNested(test, 'level1', 'level2', 'level3'); // true
     * checkNested(test, 'level1', 'level2', 'foo'); // false
     *
     * @returns {boolean}
     */
    function checkNested () {
        var args = Array.prototype.slice.call(arguments);
        var obj = args.shift();

        for ( var i = 0; i < args.length; i++ ) {
            if ( !obj.hasOwnProperty(args[i]) ) {
                return false;
            }
            obj = obj[args[i]];
        }
        return true;
    }

    function format ( str, col ) {
        col = typeof col === 'object' ? col : Array.prototype.slice.call(arguments, 1);

        return str.replace(/\{\{|\}\}|\{(\w+)\}/g, function( m, n ) {
            if ( m === "{{" ) {
                return "{";
            }
            if ( m === "}}" ) {
                return "}";
            }
            return col[n];
        });
    }

    /**
     * Simple $.ajax wrapper that expects a valid ajax options object and returns a promise
     * All caps calls are made via this method.
     *
     * @param options {Object}
     * @returns {*} promise
     */
    function getPromise ( options ) {

        var urlCaps = '/_layouts/CorasWorksApps/CorasWorksApplicationService.ashx',
            url = options.url || urlCaps,
            defaults = {
                data: null,
                dataType: 'json'
            };

        // Clean up
        if ( options.url ) {
            delete options.url;
        }

        return $.ajax(url, $.extend(true, defaults, options));
    }

    function getSiteUrl ( relDir ) {
        relDir = relDir || '/AppPages';

        return typeof L_Menu_BaseUrl !== 'undefined' ? L_Menu_BaseUrl : location.pathname.split(relDir)[0];
    }

    return {
        checkNested: checkNested,
        format: format,
        getPromise: getPromise,
        getSiteUrl: getSiteUrl

    };
});