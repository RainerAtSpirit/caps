define(function( require ) {
        'use strict';

        var optional = ['OutputType', 'XsltLocation', 'DisableVariableReplacement', 'Variables', 'DefaultValues',
            'TableName', 'RedirectURL', 'ContentDisposition', 'DatesInUtc', 'OutputFileName'];

        return  {
            batchRequest: {
                name: 'BatchRequest',
                required: {
                    params: [],
                    or: ['ConfigFileLocation', 'ConfigXml']
                },
                optional: optional
            },
            checkVariables: {
                name: 'CheckVariables',
                required: [],
                optional: optional.concat(['SiteUrl', 'CWVariable', 'DatesInUtc'])
            },
            copyFile: {
                name: 'CopyFile',
                required: ['NewFileName', 'ListTitle', 'SourceFileUrl'],
                optional: optional.concat(['SiteUrl', 'FolderName', 'Overwrite', 'IncludeWebParts', 'DeleteSource', 'Title'])
            },
            createPage: {
                name: 'CreatePage',
                required: ['FileName', 'ListTitle', 'TemplateFileName' ],
                optional: optional.concat(['SiteUrl', 'FolderName', 'Overwrite'])
            },
            executeAction: {
                name: 'ExecuteAction',
                required: ['ActionUrl', 'ListTitle', 'ItemIds' ],
                optional: optional.concat(['SiteUrl'])
            },
            getActionDefinitions: {
                name: 'GetActionDefinitions',
                required: ['ListTitle'],
                optional: optional.concat(['SiteUrl'])
            },
            getActivatedSolutions: {
                name: 'GetActivatedSolutions',
                required: [],
                optional: optional
            },
            getCentralViewData: {
                name: 'GetCentralViewData',
                required: ['ViewUrl'],
                optional: optional.concat(['SiteUrl'])
            },
            getContentTypes: {
                name: 'GetContentTypes',
                required: [],
                optional: optional.concat(['SiteUrl', 'ContentTypeTitle'])
            },
            getFileContents: {
                name: 'GetFileContents',
                required: ['FileUrl'],
                optional: optional.concat(['Encoding'])
            },
            getGlobalVariables: {
                name: 'GetGlobalVariables',
                required: [],
                optional: optional.concat(['GlobalVariables'])
            },
            getListInfo: {
                name: 'GetListInfo',
                required: [],
                optional: optional.concat(['SiteUrl', 'ListTitle', 'DetailLevels', 'Properties'])
            },
            getListItems: {
                name: 'GetListItems',
                required: ['ListTitle'],
                optional: optional.concat(['SiteUrl', 'CAML'])
            },
            getServerInfo: {
                name: 'GetServerInfo',
                required: [],
                optional: optional
            },
            getSiteCollections: {
                name: 'GetSiteCollections',
                required: [],
                optional: optional.concat(['SiteUrl', 'GetSubsites', 'SiteLevels', 'StartAtRoot'])
            },
            getSiteInfo: {
                name: 'GetSiteInfo',
                required: [],
                optional: optional.concat(['SiteUrl', 'DetailLevels', 'Properties'])
            },
            getSiteUsers: {
                name: 'GetSiteUsers',
                required: [],
                optional: optional.concat(['SiteUrl', 'User', 'DetailLevels', 'Properties'])
            },
            getVersion: {
                name: 'GetVersion',
                required: [],
                optional: optional
            },
            getWebPartPageTemplates: {
                name: 'GetWebPartPageTemplates',
                required: [],
                optional: optional
            },
            getWebPartProperties: {
                name: 'GetWebPartProperties',
                required: [],
                optional: optional.concat(['SiteUrl', 'ListTitle', 'PageUrl', 'DetailLevels'])
            },
            processBatchData: {
                name: 'ProcessBatchData',
                required: ['Batch'],
                optional: optional.concat(['SiteUrl', 'ListTitle', 'ListType'])
            },
            processGlobalVariables: {
                name: 'ProcessGlobalVariables',
                required: ['Batch'],
                optional: optional
            },
            processList: {
                name: 'ProcessList',
                required: ['ListTitle', 'Command'],
                optional: optional.concat(['SiteUrl', 'TemplateName', 'TemplateType', 'Description', 'PropertiesXml'])
            },
            startWorkflow: {
                name: 'StartWorkflow',
                required: ['WorkFlowName, ListTitle, ItemIds'],
                optional: optional.concat(['SiteUrl'])
            }
        };
    }
);