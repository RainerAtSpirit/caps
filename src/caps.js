/**
 * Caps main module that defines the public API
 */
define(function( require ) {
        'use strict';

        var $ = require('jquery'),
            Events = require('fn/events'),
            version = '0.22.1',
            caps;

        // ECMA 5 polyfills
        require('helper/polyfills');

        caps = {
            fn: require('fn/index'),
            version: version,
            checkVariables: require('checkVariables/index'),
            getActionDefinitions: require('getActionDefinitions/index'),
            getActivatedSolutions: require('getActivatedSolutions/index'),
            getGlobalVariables: require('getGlobalVariables/index'),
            getListInfo: require('getListInfo/index'),
            getListItems: require('getListItems/index'),
            getServerInfo: require('getServerInfo/index'),
            getSiteCollection: require('getSiteCollection/index'),
            getSiteInfo: require('getSiteInfo/index'),
            getSiteUsers: require('getSiteUsers/index'),
            getVersion: require('getVersion/index'),
            getWebPartPageTemplates: require('getWebPartPageTemplates/index'),
            getWebPartProperties: require('getWebPartProperties/index'),
            processBatchData: require('processBatchData/index')
        };

        // Add events in caps name space
        Events.includeIn(caps);

        // caps API
        return  caps;
    }
);