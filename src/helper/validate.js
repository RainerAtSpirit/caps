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
            path = site.replace(/^\/+|\/+$/g, '');

        errMessage = fn.format(errMessage, funcName || '');

        if ( !path ) {
            throw new Error(errMessage);
        }

        return '%WebRoot%/' + path;
    }

    return {
        getListTitle: getListTitle,
        getSiteUrl: getSiteUrl
    };
});