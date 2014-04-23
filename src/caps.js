/**
 * Caps main module that defines the public API
 */
define(function( require ) {
        'use strict';

        var Events = require('./fn/events'),
            version = '1.0.5',
            caps;

        // ECMA 5 polyfills
        require('./helper/polyfills');

        caps = {
            fn: require('./fn/index'),
            version: version,
            batchRequest: require('./batchRequest/index'),
            checkVariables: require('./checkVariables/index'),
            copyFile: require('./copyFile/index'),
            createPage: require('./createPage/index'),
            executeAction: require('./executeAction/index'),
            getActionDefinitions: require('./getActionDefinitions/index'),
            getActivatedSolutions: require('./getActivatedSolutions/index'),
            getCentralViewData: require('./getCentralViewData/index'),
            getContentTypes: require('./getContentTypes/index'),
            getFileContents: require('./getFileContents/index'),
            getGlobalVariables: require('./getGlobalVariables/index'),
            getListInfo: require('./getListInfo/index'),
            getListItems: require('./getListItems/index'),
            getServerInfo: require('./getServerInfo/index'),
            getSiteCollections: require('./getSiteCollections/index'),
            getSiteInfo: require('./getSiteInfo/index'),
            getSiteUsers: require('./getSiteUsers/index'),
            getVersion: require('./getVersion/index'),
            getWebPartPageTemplates: require('./getWebPartPageTemplates/index'),
            getWebPartProperties: require('./getWebPartProperties/index'),
            processBatchData: require('./processBatchData/index'),
            processGlobalVariables: require('./processGlobalVariables/index'),
            processList: require('./processList/index'),
            startWorkflow: require('./startWorkflow/index')
        };

        // Add events in caps name space
        Events.includeIn(caps);

        // caps API
        return  caps;
    }
);