/*global caps */

define(function( require ) {
    'use strict';
    var fn = require('../fn/common'),
        L_Menu_BaseUrl = window.L_Menu_BaseUrl || null,
        messages = {
            getSiteUrl: 'caps.{0}(). Missing required "siteUrl" property and fallback method "L_Menu_BaseUrl" is undefined.',
            getListTitle: 'caps.{0}(). Missing required "listTitle" property',
            getFileUrl: 'caps.{0}(). Missing required "fileUrl" property',
            getRequiredParam: 'caps.{0}(). Missing required "{1}" property'
        };

    /**
     * Check if value is undefined and throws error message
     * @param param {string}
     * @param value {string}
     * @param funcName {string} function name for error message
     * @returns {*} listTitle
     */
    function getRequiredParam ( param, value, funcName ) {
        var errMessage = messages.getRequiredParam;
        errMessage = fn.format(errMessage, funcName || '', param);

        if ( typeof value === 'undefined' ) {
            throw new Error(errMessage);
        }

        return value;
    }

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
     * Check if fileUrl exists and throw error
     * @param fileUrl {string}
     * @param funcName {string} function name for error message
     * @returns {*} listTitle
     */
    function getFileUrl ( fileUrl, funcName ) {
        var errMessage = messages.getFileUrl;
        errMessage = fn.format(errMessage, funcName || '');

        if ( !fileUrl ) {
            throw new Error(errMessage);
        }

        return fileUrl;
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
            containsGlobal,
            containsVariable;

        if ( !path ) {
            path = fn.getSiteUrl();
        }

        containsGlobal = path.match(/\[.+?\]/g);
        containsVariable = path.match(/\%.+?\%/g);

        // add %WebRoot%/ as long as path doesn't contain a global variable or a caps variable

        if ( !containsGlobal && !containsVariable ) {
            path = '%WebRoot%/' + path;
        }

        return path;
    }

    function addOptionalProperties ( options, data, properties ) {

        $.each(options, function(prop, value){

            var propIndex = fn.strInArray(prop, properties),
                propName;

            if (propIndex > -1){
                propName = properties[propIndex];

                data[propName] = value;
            }
        });


        /*$.each(properties, function( idx, property ) {
            var propName = property.charAt(0).toLowerCase() + property.substring(1),
                value = options[propName];


            if ( typeof value !== 'undefined' ) {
                data[property] = value;
            }

        });
*/
        return data;
    }

    return {
        addOptionalProperties: addOptionalProperties,
        getRequiredParam: getRequiredParam,
        getListTitle: getListTitle,
        getSiteUrl: getSiteUrl,
        getFileUrl: getFileUrl
    };
});