/* global caps */
define(function( require ) {
    'use strict';

    var L_Menu_BaseUrl = window.L_Menu_BaseUrl;

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
            request,
            defaults = {
                data: null,
                dataType: 'json'
            };

        // Clean up
        if ( options.url ) {
            delete options.url;
        }

        request = $.extend(true, {}, defaults, options);

        return $.ajax(url, request)
            .then(function( response ) {

                // Advanced processing for OutputType json
                if ( request.data.OutputType === 'json' ) {
                    return processResponse(request, response);
                }

                return response;
            });
    }

    function getSiteUrl () {
        var soapEnv = '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><{0} xmlns="http://schemas.microsoft.com/sharepoint/soap/" >{1}</{0}></soap:Body></soap:Envelope>',
            siteName = '',
            pageUrl;

        // fast
        if ( typeof L_Menu_BaseUrl !== 'undefined' ) {
            return L_Menu_BaseUrl;
        }

        pageUrl = format('<pageUrl>{0}</pageUrl>', location.href.split('?')[0]);

        // fallback using async false!
        $.ajax('/_vti_bin/Webs.asmx', {
            async: false,
            type: 'POST',
            dataType: 'xml',
            data: format(soapEnv, 'WebUrlFromPageUrl', pageUrl),
            contentType: 'text/xml; charset="utf-8"'
        })
            .complete(function( response ) {
                siteName = $(response.responseXML).find("WebUrlFromPageUrlResult").text() ;
            });

        return siteName;
    }

    return {
        checkNested: checkNested,
        format: format,
        getPromise: getPromise,
        getSiteUrl: getSiteUrl

    };

    //Internal
    function processResponse ( request, response ) {
        var method = request.data.RequestType;

        // reject defer if response has an error payload

        return $.Deferred(function( deferred ) {
            var problem = hasError(request, response);

            if ( problem ) {
                return deferred.reject(problem);
            }

            deferred.resolve(response);
        }).promise();

        function hasError ( request, response ) {
            var problem = null;

            // some methods e.g. GetListInfo reply with NewDataSet'methodName].ErrorInfo
            if ( checkNested(response, 'NewDataSet', method, 'ErrorInfo') ) {
                problem = response.NewDataSet[method].ErrorInfo;
            }

            // some methods e.g. GetActionDefinitions reply with NewDataSet.ErrorInfo
            if ( checkNested(response, 'NewDataSet', 'ErrorInfo') ) {
                problem = response.NewDataSet.ErrorInfo;
            }

            // some methods reply with ErrorInfo
            if ( checkNested(response, 'ErrorInfo') ) {
                problem = response.ErrorInfo;
            }

            if ( problem ) {
                // trigger on global caps error channel
                caps.trigger('error', problem, request, response);
            }

            return problem;
        }
    }
});