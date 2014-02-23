(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // Allow using this built library as an AMD module
        // in another project. That other project will only
        // see this AMD call, not the internal modules in
        // the closure below.
        define(factory);
    } else {
        //Browser globals case. Just assign the
        //result to a property on the global.
        root.caps = factory();
    }
}(this, function () {
    //almond, and your modules will be inlined here


/**
 * @license almond 0.2.9 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("almond", function(){});

define('common',[],function() {
    

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

    return {
        checkNested: checkNested,
        getPromise: getPromise,
        format: format
    };
});
//Scaffolding template. See src/processBatchData and test/modules/processBatchData for implementation example
define('batchRequest/index',['require'],function( require ) {
        

        function batchRequest ( options, params ) {}

        return batchRequest;
    }
);
define('processBatchData/createBatchXML',['require','jquery','common'],function( require ) {
        
        var $ = require('jquery'),
            common = require('common'),
            Ctor, instance;

        Ctor = function() {
            this.methods = "";
        };

        instance = {
            create: function createBatchXML ( json ) {
                var options = $.isArray(json) ? json : [json],
                    self = this,
                    i,
                    len = options.length;

                self.methods = '<Batch><ows:Batch OnError="Continue"  xmlns:ows="http://www.corasworks.net/2012/ows">';

                for ( i = 0; i < len; i++ ) {
                    self.processList(options[i]);
                }

                self.methods += '</ows:Batch></Batch>';

                return self.methods;
            },
            processList: function( list ) {
                var self = this,
                    batches = $.isArray(list.batch) ? list.batch : [list.batch],
                    i,
                    len = batches.length;

                for ( i = 0; i < len; i++ ) {
                    self.processItems(list.name, batches[i]);
                }

            },
            processItems: function( listName, batch ) {
                var self = this,
                    items = $.isArray(batch.items) ? batch.items : [batch.items],
                    i,
                    len = items.length,
                    typeMap = {
                        'create': 'New',
                        'update': 'Update',
                        'delete': 'Delete'
                    };

                for ( i = 0; i < len; i++ ) {
                    var item = items[i];
                    self.methods += this.format(
                        '<Method ID="{methodId}">' +
                            '<SetList>%{list}%</SetList>' +
                            '<SetVar Name="Cmd">{cmd}</SetVar>',
                        {
                            methodId: (item.Id ? item.Id + ',' + typeMap[batch.method] : typeMap[batch.method]) +
                                ',' + listName,
                            list: listName,
                            cmd: batch.method === 'delete' ? 'Delete' : 'Save'
                        }
                    );
                    self.processProps(item);
                    self.methods += '</Method>';
                }
            },
            processProps: function( item ) {
                var self = this,
                    prop;

                self.methods += this.format('<SetVar Name="ID">{itemId}</SetVar>',
                    {itemId: item.Id || 'New'});

                for ( prop in item ) {
                    if ( item.hasOwnProperty(prop) ) {
                        if ( prop !== 'Id' ) {
                            self.methods += this.format(
                                '<SetVar Name="urn:schemas-microsoft-com:office:office#{0}"><![CDATA[{1}]]></SetVar>',
                                prop, item[prop]);
                        }
                    }
                }
            }
        };

        $.extend(true, Ctor.prototype, common, instance);

        return new Ctor();
    }
);
define('processBatchData/index',['require','jquery','./createBatchXML'],function( require ) {
        

        var $ = require('jquery'),
            createBatchXML = require('./createBatchXML'),
            L_Menu_BaseUrl = window.L_Menu_BaseUrl || null,
            defaults;

        defaults = {
            type: 'POST',
            data: {
                RequestType: 'ProcessBatchData',
                OutputType: 'json'
            }
        };

        function ProcessBatchData ( options , params) {
            var siteUrl, listTitle, batch, request;

            options = isValidOption(options);

            siteUrl = isValidSite(options);

            batch = createBatchXML.create(options);

            listTitle = $.map(options,function( obj ) {
                return obj.name;
            }).join(',');

            request = $.extend(true, defaults, params, {
                data: {
                    SiteUrl: siteUrl,
                    ListTitle: listTitle,
                    Batch: batch
                }
            });

            return this.getPromise(request);
        }


        return ProcessBatchData;



        function isValidOption ( options ) {

            //Todo: check if passed in object has a supported format
            if ( !true ) {
                throw new Error('caps.processBatchData(). Invalid options');
            }

            return $.isArray(options) ? options : [options];
        }

        function isValidSite ( options ) {
            var baseUrl = L_Menu_BaseUrl ? L_Menu_BaseUrl : '',
                site = options[0].site ? options[0].site : baseUrl,
                path = site.replace(/^\/+|\/+$/g, '');

            if ( !path ) {
                throw new Error('caps.processBatchData(). Missing required site property and fallback method L_Menu_BaseUrl is undefined.');
            }

            return '%WebRoot%' + site;
        }
    }
);
define('getListItems/index',['require','jquery'],function( require ) {
        

        var $ = require('jquery'),
            L_Menu_BaseUrl = window.L_Menu_BaseUrl || null,
            defaults;

        defaults = {
            type: 'GET',
            data: {
                RequestType: 'GetListItems',
                OutputType: 'json'
            }
        };

        function GetListItems ( options, params ) {
            var siteUrl, listTitle, request;

            options = isValidOption(options);
            siteUrl = isValidSiteUrl(options);
            listTitle = isValidListTitle(options);

            request = $.extend(true, defaults, params, {
                data: {
                    SiteUrl: siteUrl,
                    ListTitle: listTitle
                }
            });

            return this.getPromise(request);

        }

        return GetListItems;


        function isValidOption ( options ) {

            //Todo: check if passed in object has a supported format

            if ( !true ) {
                throw new Error('caps.getListItems(). Invalid options');
            }

            return options || {};
        }

        function isValidSiteUrl ( options ) {
            var baseUrl = L_Menu_BaseUrl ? L_Menu_BaseUrl : '',
                site = options.siteUrl ? options.siteUrl : baseUrl,
                path = site.replace(/^\/+|\/+$/g, '');

            if ( !path ) {
                throw new Error('caps.getListItems(). Missing required site property and fallback method L_Menu_BaseUrl is undefined.');
            }

            return '%WebRoot%/' + path;
        }

        function isValidListTitle ( options ) {

            if ( !options.listTitle ) {
                throw new Error('caps.getListItems(). Missing required title property');
            }

            return options.listTitle;
        }
    }
);
define('getListInfo/index',['require','jquery'],function( require ) {
        

        var $ = require('jquery'),
            L_Menu_BaseUrl = window.L_Menu_BaseUrl || null,
            defaults;

        defaults = {
            type: 'GET',
            data: {
                RequestType: 'GetListInfo',
                OutputType: 'json'
            }
        };

        function GetListInfo ( options, params ) {
            var siteUrl, listTitle, request;

            options = isValidOption(options);
            siteUrl = isValidSiteUrl(options);
            listTitle = isValidListTitle(options);

            request = $.extend(true, defaults, params, {
                data: {
                    SiteUrl: siteUrl,
                    ListTitle: listTitle
                }
            });

            return this.getPromise(request);

        }

        return GetListInfo;


        function isValidOption ( options ) {

            //Todo: check if passed in object has a supported format

            if ( !true ) {
                throw new Error('caps.getListInfo(). Invalid options');
            }

            return options || {};
        }

        function isValidSiteUrl ( options ) {
            var baseUrl = L_Menu_BaseUrl ? L_Menu_BaseUrl : '',
                site = options.SiteUrl  ? options.SiteUrl  : baseUrl,
                path = site.replace(/^\/+|\/+$/g, '');

            if ( !path ) {
                throw new Error('caps.getListInfo(). Missing required "siteUrl" property and fallback method L_Menu_BaseUrl is undefined.');
            }

            return '%WebRoot%/' + path;
        }

        function isValidListTitle ( options ) {

            if ( !options.listTitle ) {
                return '';
            }

            return options.listTitle;
        }
    }
);
/**
 * Caps main module that defines the public API
 */
define('caps',['require','common','batchRequest/index','processBatchData/index','getListItems/index','getListInfo/index','processBatchData/createBatchXML'],function( require ) {
        
        var version = '0.5.1',
            common = require('common'),
        // todo: Move to methods once depracated have been removed
            batchRequest = require('batchRequest/index'),
            processBatchData = require('processBatchData/index'),
            Caps, deprecated, fn;

        Caps = function() {
            var self = this;
            this.version = version;
            this.batchRequest = batchRequest;
            this.processBatchData = processBatchData;
            this.getListItems = require('getListItems/index');
            this.getListInfo = require('getListInfo/index');
        };

        //Todo: Check with Michael if this could be removed in 1.x.x
        deprecated = {
            ProcessBatchData: processBatchData,
            BatchRequest: batchRequest
        };

        /**
         * fn hosts helper function that we don't want to expose in the caps root namespace
         */
        fn = {
            fn: {
                createBatchXML: function createBatchXML ( options ) {
                    var batchXML = require('processBatchData/createBatchXML');
                    return  batchXML.create(options);
                }
            }
        };

        $.extend(true, Caps.prototype, common, fn, deprecated);

        //Return public API
        return new Caps();
    }
);
    //Register in the values from the outer closure for common dependencies  as local almond modules
    define('jquery', function () {
        return $;
    });
     // The modules for your project will be inlined above
     // this snippet. Ask almond to synchronously require the
     // module value for 'main' here and return it as the
     // value to use for the public API for the built file.
     return require('caps');
 }));
