/* global caps */
define(function( require ) {
    'use strict';

   // var L_Menu_BaseUrl = window.L_Menu_BaseUrl;

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

        var L_Menu_BaseUrl = window.L_Menu_BaseUrl,
            relUrlCaps = L_Menu_BaseUrl ? L_Menu_BaseUrl : '',
            urlCaps = relUrlCaps + '/_layouts/CorasWorksApps/CorasWorksApplicationService.ashx',
            url = options.url || urlCaps,
            isSameSite,
            request,
            defaults = {
                data: null,
                dataType: 'json'
            };

        // Clean up
        if ( options.url ) {
            delete options.url;
        }

        // Avoid adding SiteUrl param for the current site
        if ( options.data && options.data.SiteUrl){
            isSameSite = options.data.SiteUrl.toLowerCase() === relUrlCaps.toLowerCase();

            if (isSameSite){
                delete options.data.SiteUrl;
            }
        }
        // Clean up

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

    function getSiteUrl ( relDir ) {
        var L_Menu_BaseUrl = window.L_Menu_BaseUrl,
            soapEnv = '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><{0} xmlns="http://schemas.microsoft.com/sharepoint/soap/" >{1}</{0}></soap:Body></soap:Envelope>',
            pathName = location.pathname.toLocaleLowerCase(),
            site = '',
            siteLink = '',
            pageUrl;

        relDir = relDir ? relDir.toLocaleLowerCase() : '/apppages';

        // Using L_Menu_BaseUrl if available
        if ( typeof L_Menu_BaseUrl !== 'undefined' ) {
            return L_Menu_BaseUrl;
        }

        // Testing if relDir exists in path
        if ( pathName.indexOf(relDir) > -1 ) {
            return pathName.split(relDir)[0];
        }

        // last resort using webs.asmx with async false!

        pageUrl = format('<pageUrl>{0}</pageUrl>', location.href.split('?')[0]);

        $.ajax('/_vti_bin/Webs.asmx', {
            async: false,
            type: 'POST',
            dataType: 'xml',
            data: format(soapEnv, 'WebUrlFromPageUrl', pageUrl),
            contentType: 'text/xml; charset="utf-8"'
        })
            .complete(function( response ) {
                site = siteLink = $(response.responseXML).find("WebUrlFromPageUrlResult").text();

                if (site.indexOf('://')){
                    siteLink = site.split(location.hostname)[1];
                }

            });

        return siteLink;
    }

    // http://stackoverflow.com/questions/3390930/any-way-to-make-jquery-inarray-case-insensitive
    /**
     *
     * @param string {string} value to check
     * @param arr {array}
     * @param i {int} optional start index
     * @returns {*}
     */
    function strInArray ( string, arr, i ) {
        var len;

        // confirm array is populated

        if ( arr ) {
            len = arr.length;
            i = i ? (i < 0 ? Math.max(0, len + i) : i) : 0;

            string = string.toLowerCase();

            for ( ; i < len; i++ ) {
                if ( i in arr && arr[i].toLowerCase() === string ) {
                    return i;
                }
            }
        }

        // stick with inArray/indexOf and return -1 on no match
        return -1;
    }

    return {
        checkNested: checkNested,
        format: format,
        getPromise: getPromise,
        getSiteUrl: getSiteUrl,
        strInArray: strInArray

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

            // some methods e.g. GetListItems might reply NewDataSet.GetListItems.listItems.ErrorInfo
            if ( checkNested(response, 'NewDataSet', 'GetListItems', 'listitems', 'ErrorInfo') ) {
                problem = response.NewDataSet.GetListItems.listitems.ErrorInfo;
            }

            if ( problem ) {
                // trigger on global caps error channel
                caps.trigger('error', problem, request, response);
            }

            return problem;
        }
    }
});