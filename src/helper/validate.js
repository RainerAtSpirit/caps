/*global caps */

define(function( require ) {
    'use strict';
    var fn = require('fn/common'),
        L_Menu_BaseUrl = window.L_Menu_BaseUrl || null,
        messages = {
            getSiteUrl: 'caps.{0}(). Missing required "siteUrl" property and fallback method "L_Menu_BaseUrl" is undefined.',
            getListTitle: 'caps.{0}(). Missing required "listTitle" property'
        };

    /**
     * Check if listTitle exists and throw error
     * @param listTitle {string}
     * @param funcName {string} function name for error message
     * @returns {*} listTitle
     */
    function getListTitle ( listTitle, funcName ) {
        var errMessage = messages.getListTitle;
        errMessage = fn.format(errMessage, funcName || '');

        if ( !listTitle ) {
            throw new Error(errMessage);
        }

        return listTitle;
    }

    /**
     * Check if siteUrl exists and fallback to use L_Menu_BaseUrl (local site). Throw error if both are undefined
     * @param siteUrl {string}
     * @param funcName {string}
     * @returns {string} siteUrl
     */
    function getSiteUrl ( siteUrl, funcName ) {

        var baseUrl = L_Menu_BaseUrl ? L_Menu_BaseUrl : '',
            errMessage = messages.getSiteUrl,
            site = siteUrl ? siteUrl : baseUrl,
            path = site.replace(/^\/+|\/+$/g, ''),
            containsGlobal = path.match(/\[.+?\]/g),
            containsVariable = path.match(/\%.+?\%/g);

        errMessage = fn.format(errMessage, funcName || '');

        if ( !path ) {
            throw new Error(errMessage);
        }

        // add %WebRoot%/ as long as path doesn't contain a global variable or a caps variable

        if ( !containsGlobal && !containsVariable ) {
            path = '%WebRoot%/' + path;
        }

        return path;
    }

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
            if ( fn.checkNested(response, 'NewDataSet', method, 'ErrorInfo') ) {
                problem = response.NewDataSet[method].ErrorInfo;

                // trigger on global caps error channel
                caps.trigger('error', problem, request, response);
            }

            // some methods e.g. GetActionDefinitions reply with NewDataSet.ErrorInfo
            if ( fn.checkNested(response, 'NewDataSet', 'ErrorInfo') ) {
                problem = response.NewDataSet.ErrorInfo;

                // trigger on global caps error channel
                caps.trigger('error', problem, request, response);
            }

            return problem;
        }
    }

    return {
        getListTitle: getListTitle,
        getSiteUrl: getSiteUrl,
        processResponse: processResponse
    };
});