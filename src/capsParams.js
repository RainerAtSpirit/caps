define(function( require ) {
        'use strict';

        var optional = ['OutputType', 'XsltLocation', 'DisableVariableReplacement', 'Variables', 'DefaultValues', 'TableName', 'TransformType', 'OutputFileName'];

        return  {
            batchRequest: {
                factory: true,
                required: ['RequestType', 'ConfigFileLocation || ConfigXml'],
                optional: optional
            },
            checkVariables: {
                factory: true,
                required: ['RequestType', 'SiteUrl', 'CWVariable', 'DatesInUtc'],
                optional: optional
            },
            copyFile: {
                factory: true,
                required: ['RequestType', 'NewFileName', 'ListTitle', 'SourceFileUrl'],
                optional: optional.concat(['SiteUrl', 'FolderName', 'Overwrite', 'IncludeWebParts', 'DeleteSource', 'Title'])
            },
            createPage: {
                factory: true,
                required: ['RequestType', 'FileName', 'ListTitle', 'TemplateFileName', 'Overwrite' ],
                optional: optional.concat(['SiteUrl', 'FolderName', 'Overwrite'])
            },
            executeAction: {
                factory: true,
                required: ['RequestType', 'ActionUrl', 'ListTitle', 'ItemIds' ],
                optional: optional.concat(['SiteUrl'])
            },
            getActionDefinitions: {
                factory: true,
                required: ['RequestType', 'ListTitle'],
                optional: optional.concat(['SiteUrl'])
            },
            getActivatedSolutions: {
                factory: true,
                required: ['RequestType'],
                optional: optional
            },
            getCentralViewData: {
                factory: true,
                required: ['RequestType', 'ViewUrl'],
                optional: optional.concat(['SiteUrl'])
            },
            getContentTypes: {
                factory: true,
                required: ['RequestType'],
                optional: optional.concat(['ContentTypeTitle'])
            },
            getFileContents: {
                factory: true,
                required: ['RequestType', 'FileUrl'],
                optional: optional.concat(['Encoding'])
            },
            getGlobalVariables: {
                factory: true,
                required: ['RequestType'],
                optional: optional.concat(['GlobalVariables'])
            },
            getListInfo: {
                factory: false,
                required: ['RequestType'],
                optional: optional.concat(['SiteUrl', 'ListTitle', 'DetailLevels', 'Properties'])
            },
            getListItems: {
                factory: false,
                required: ['RequestType', 'ListTitle'],
                optional: optional.concat(['SiteUrl', 'CAML'])
            },
            getServerInfo: {
                factory: true,
                required: ['RequestType'],
                optional: optional
            },
            getSiteCollections: {
                factory: true,
                required: ['RequestType'],
                optional: optional.concat(['SiteUrl', 'GetSubsites', 'SiteLevels', 'StartAtRoot'])
            },
            getSiteInfo: {
                factory: true,
                required: ['RequestType'],
                optional: optional.concat(['SiteUrl', 'DetailLevels', 'Properties'])
            },
            getSiteUsers: {
                factory: true,
                required: ['RequestType'],
                optional: optional.concat(['SiteUrl', 'Users', 'DetailLevels', 'Properties'])
            },
            getVersion: {
                factory: true,
                required: ['RequestType'],
                optional: optional
            },
            getWebPartPageTemplates: {
                factory: true,
                required: ['RequestType'],
                optional: optional
            },
            getWebPartProperties: {
                factory: true,
                required: ['RequestType'],
                optional: optional.concat(['SiteUrl', 'ListTitle', 'PageUrl', 'DetailLevels'])
            },
            processBatchData: {
                factory: false,
                required: ['RequestType', 'Batch'],
                optional: optional.concat(['SiteUrl', 'ListTitle'])
            },
            processGlobalVariables: {
                factory: true,
                required: ['RequestType', 'Batch'],
                optional: optional
            },
            processList: {
                factory: true,
                required: ['RequestType', 'ListTitle', 'Command'],
                optional: optional.concat(['SiteUrl', 'TemplateName', 'TemplateType', 'Description', 'PropertiesXml'])
            },
            startWorkflow: {
                factory: true,
                required: ['RequestType', 'WorkFlowName, ListTitle, ItemIds'],
                optional: optional.concat(['SiteUrl'])
            }
        };

    }
);