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
/**
 * Based on Durandal http://www.durandaljs.com 2.0 events module
 * Durandal events originate from backbone.js but also combine some ideas from signals.js as well as some additional improvements.
 * Events can be installed into any object and are installed into the `app` module by default for convenient app-wide eventing.
 * @module events
 * @requires system
 */
define('events/index',['require'],function( require ) {
    
    var keys = Object.keys,
        eventSplitter = /\s+/,
        Events = function() {
        },

        /**
         * Represents an event subscription.
         * @class Subscription
         */
            Subscription = function( owner, events ) {
            this.owner = owner;
            this.events = events;
        };

    /**
     * Attaches a callback to the event subscription.
     * @method then
     * @param {function} callback The callback function to invoke when the event is triggered.
     * @param {object} [context] An object to use as `this` when invoking the `callback`.
     * @chainable
     */
    Subscription.prototype.then = function( callback, context ) {
        this.callback = callback || this.callback;
        this.context = context || this.context;

        if ( !this.callback ) {
            return this;
        }

        this.owner.on(this.events, this.callback, this.context);
        return this;
    };

    /**
     * Attaches a callback to the event subscription.
     * @method on
     * @param {function} [callback] The callback function to invoke when the event is triggered. If `callback` is not provided, the previous callback will be re-activated.
     * @param {object} [context] An object to use as `this` when invoking the `callback`.
     * @chainable
     */
    Subscription.prototype.on = Subscription.prototype.then;

    /**
     * Cancels the subscription.
     * @method off
     * @chainable
     */
    Subscription.prototype.off = function() {
        this.owner.off(this.events, this.callback, this.context);
        return this;
    };

    /**
     * Creates an object with eventing capabilities.
     * @class Events
     */

    /**
     * Creates a subscription or registers a callback for the specified event.
     * @method on
     * @param {string} events One or more events, separated by white space.
     * @param {function} [callback] The callback function to invoke when the event is triggered. If `callback` is not provided, a subscription instance is returned.
     * @param {object} [context] An object to use as `this` when invoking the `callback`.
     * @return {Subscription|Events} A subscription is returned if no callback is supplied, otherwise the events object is returned for chaining.
     */
    Events.prototype.on = function on( events, callback, context ) {
        var calls, event, list;

        if ( !callback ) {
            return new Subscription(this, events);
        }
        else {
            calls = this.callbacks || (this.callbacks = {});
            events = events.split(eventSplitter);

            /*jshint boss:true */
            while ( event = events.shift() ) {
                list = calls[event] || (calls[event] = []);
                list.push(callback, context);
            }

            return this;
        }
    };

    /**
     * Removes the callbacks for the specified events.
     * @method off
     * @param {string} [events] One or more events, separated by white space to turn off. If no events are specified, then the callbacks will be removed.
     * @param {function} [callback] The callback function to remove. If `callback` is not provided, all callbacks for the specified events will be removed.
     * @param {object} [context] The object that was used as `this`. Callbacks with this context will be removed.
     * @chainable
     */
    Events.prototype.off = function off( events, callback, context ) {
        var event, calls, list, i;

        // No events
        if ( !(calls = this.callbacks) ) {
            return this;
        }

        //removing all
        if ( !(events || callback || context) ) {
            delete this.callbacks;
            return this;
        }

        events = events ? events.split(eventSplitter) : keys(calls);

        /*jshint boss:true */
        // Loop through the callback list, splicing where appropriate.
        while ( event = events.shift() ) {
            if ( !(list = calls[event]) || !(callback || context) ) {
                delete calls[event];
                continue;
            }

            for ( i = list.length - 2; i >= 0; i -= 2 ) {
                if ( !(callback && list[i] !== callback || context && list[i + 1] !== context) ) {
                    list.splice(i, 2);
                }
            }
        }

        return this;
    };

    /**
     * Triggers the specified events.
     * @method trigger
     * @param {string} [events] One or more events, separated by white space to trigger.
     * @chainable
     */
    Events.prototype.trigger = function trigger( events ) {
        var event, calls, list, i, length, args, all, rest;
        if ( !(calls = this.callbacks) ) {
            return this;
        }

        rest = [];
        events = events.split(eventSplitter);
        for ( i = 1, length = arguments.length; i < length; i++ ) {
            rest[i - 1] = arguments[i];
        }

        /*jshint boss:true */
        // For each event, walk through the list of callbacks twice, first to
        // trigger the event, then to trigger any `"all"` callbacks.
        while ( event = events.shift() ) {
            // Copy callback lists to prevent modification.
            if ( all = calls.all ) {
                all = all.slice();
            }

            if ( list = calls[event] ) {
                list = list.slice();
            }

            // Execute event callbacks.
            if ( list ) {
                for ( i = 0, length = list.length; i < length; i += 2 ) {
                    list[i].apply(list[i + 1] || this, rest);
                }
            }

            // Execute "all" callbacks.
            if ( all ) {
                args = [event].concat(rest);
                for ( i = 0, length = all.length; i < length; i += 2 ) {
                    all[i].apply(all[i + 1] || this, args);
                }
            }
        }

        return this;
    };

    /**
     * Creates a function that will trigger the specified events when called. Simplifies proxying jQuery (or other) events through to the events object.
     * @method proxy
     * @param {string} events One or more events, separated by white space to trigger by invoking the returned function.
     * @return {function} Calling the function will invoke the previously specified events on the events object.
     */
    Events.prototype.proxy = function proxy( events ) {
        var that = this;
        return (function( arg ) {
            that.trigger(events, arg);
        });
    };

    /**
     * Creates an object with eventing capabilities.
     * @class EventsModule
     * @static
     */

    /**
     * Adds eventing capabilities to the specified object.
     * @method includeIn
     * @param {object} targetObject The object to add eventing capabilities to.
     */
    Events.includeIn = function( targetObject ) {
        targetObject.on = Events.prototype.on;
        targetObject.off = Events.prototype.off;
        targetObject.trigger = Events.prototype.trigger;
        targetObject.proxy = Events.prototype.proxy;
    };

    return Events;
});
define('events',['require','events/index'],function(require) {
    

    var Events = require('events/index'),
        events = {};

    Events.includeIn(events);

    return events;
});
define('processBatchData/createBatchXML',['require','jquery','common'],function( require ) {
        
        var $ = require('jquery'),
            fn = require('common');


        function createBatchXML ( json ) {
            var options = $.isArray(json) ? json : [json],
                i,
                len = options.length,
                methods = "";

            methods = '<Batch><ows:Batch OnError="Continue"  xmlns:ows="http://www.corasworks.net/2012/ows">';

            for ( i = 0; i < len; i++ ) {
                processList(options[i]);
            }

            methods += '</ows:Batch></Batch>';

            return methods;

            function processList ( list ) {
                var batches = $.isArray(list.batch) ? list.batch : [list.batch],
                    i,
                    len = batches.length;

                for ( i = 0; i < len; i++ ) {
                    processItems(list.name, batches[i]);
                }

            }

            function processItems ( listName, batch ) {
                var items = $.isArray(batch.items) ? batch.items : [batch.items],
                    i,
                    len = items.length,
                    typeMap = {
                        'create': 'New',
                        'update': 'Update',
                        'delete': 'Delete'
                    };

                for ( i = 0; i < len; i++ ) {
                    var item = items[i];
                    methods += fn.format(
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
                    processProps(item);
                    methods += '</Method>';
                }
            }

            function processProps ( item ) {
                var prop;

                methods += fn.format('<SetVar Name="ID">{itemId}</SetVar>',
                    {itemId: item.Id || 'New'});

                for ( prop in item ) {
                    if ( item.hasOwnProperty(prop) ) {
                        if ( prop !== 'Id' ) {
                            methods += fn.format(
                                '<SetVar Name="urn:schemas-microsoft-com:office:office#{0}"><![CDATA[{1}]]></SetVar>',
                                prop, item[prop]);
                        }
                    }
                }
            }

        }

        return createBatchXML;
    }
);
define('getListItems/convertFilter2Caml',['require','jquery','common'],function( require ) {
        
        var $ = require('jquery'),
            fn = require('common'),
            instance,
            camlMap = {
                'eq': 'Eq',
                'neq': 'Neq',
                'lt': 'Lt',
                'lte': 'Leq',
                'gt': 'Gt',
                'gte': 'Geq',
                'startswith': 'BeginsWith',
                'contains': 'Contains'
            },
            logicMap = {
                'and': 'And',
                'or': 'Or',
                'And': 'And',
                'Or': 'Or'
            },
            groupMap = {
                'Or': 'Or Group="true"',
                'And': 'And Group="true"'
            };

        function convertFilter2Caml ( oFilter, oFields ) {
            var filter = [],
                caml = [];

            filter.push('<Where>');

            if ( oFilter && oFilter.filters.length === 1 && oFilter.filters[0].field ) {
                filter.push(createExpression(oFilter.filters[0]));
            }
            else {
                convertBinarySearchTree2Caml(oFilter);
                filter.push(caml.join(''));
            }
            filter.push('</Where>');

            return (filter.join(''));

            // Internal
            function convertBinarySearchTree2Caml ( filter, filterID ) {
                var fID = '',
                    rfilters = filter.filters,
                    logic = logicMap[filter.logic || 'And'],
                    groupID;

                groupID = (typeof filterID !== 'undefined') ? parseInt(filterID.substring(filterID.lastIndexOf('.') + 1), 10) : 0;

                if ( groupID > 0 && groupID % 2 === 0 ) {
                    caml.unshift(caml[0]);
                    caml.push(caml[0].replace('<', '</'));
                }
                caml.push(fn.format('<{0}>', (typeof filterID !== 'undefined') ? groupMap[logic] : logic));

                $.each(rfilters, function( idx, currFilter ) {

                    fID = filterID ? filterID + '.' + idx.toString() : idx.toString();

                    if ( typeof currFilter.logic !== 'undefined' ) {
                        convertBinarySearchTree2Caml(currFilter, fID);
                    }
                    else {
                        if ( idx > 1 ) {
                            var insertIdx = caml.lastIndexOf('<' + groupMap[logic] + '>') + 1;

                            if ( insertIdx === -1 ) {
                                caml.unshift(fn.format('<{0}>', logic));
                            }
                            else {
                                caml.splice(insertIdx, 0, fn.format('<{0}>', logic));
                            }

                            caml.push(fn.format('</{0}>', logic));
                        }
                        caml.push(createExpression(currFilter));
                    }
                });

                caml.push(fn.format('</{0}>', logic));
            }

            function createExpression ( filterObj ) {
                filterObj = $.isArray(filterObj) ? filterObj[0] : filterObj;
                var filterExpr = "<{0}><FieldRef Name='{1}' /><Value Type='{2}'>{3}</Value></{0}>",
                    val = filterObj.value,
                    operator = camlMap[filterObj.operator],
                    field = filterObj.field,
                    type = oFields[filterObj.field].type;

                return fn.format(filterExpr, operator, field, type, val);
            }

        }

        return convertFilter2Caml;

    }
);


define('polyfills',[],function() {
    
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if ( !Object.keys ) {
        Object.keys = (function() {
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function( obj ) {
                if ( typeof obj !== 'object' && (typeof obj !== 'function' || obj === null) ) {
                    throw new TypeError('Object.keys called on non-object');
                }

                var result = [], prop, i;

                for ( prop in obj ) {
                    if ( hasOwnProperty.call(obj, prop) ) {
                        result.push(prop);
                    }
                }

                if ( hasDontEnumBug ) {
                    for ( i = 0; i < dontEnumsLength; i++ ) {
                        if ( hasOwnProperty.call(obj, dontEnums[i]) ) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }());
    }
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
    if ( !Array.prototype.lastIndexOf ) {
        Array.prototype.lastIndexOf = function( searchElement /*, fromIndex*/ ) {

            if ( this == null ) {
                throw new TypeError();
            }

            var n, k,
                t = Object(this),
                len = t.length >>> 0;
            if ( len === 0 ) {
                return -1;
            }

            n = len;
            if ( arguments.length > 1 ) {
                n = Number(arguments[1]);
                if ( n != n ) {
                    n = 0;
                }
                else if ( n != 0 && n != (1 / 0) && n != -(1 / 0) ) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }

            for ( k = n >= 0
                ? Math.min(n, len - 1)
                : len - Math.abs(n); k >= 0; k-- ) {
                if ( k in t && t[k] === searchElement ) {
                    return k;
                }
            }
            return -1;
        };
    }
});
define('processBatchData/index',['require','jquery','common','./createBatchXML'],function( require ) {
        

        var $ = require('jquery'),
            fn = require('common'),
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

        function processBatchData ( options, params ) {
            var siteUrl, listTitle, batch, request;

            options = validOptions(options);

            siteUrl = validSiteUrl(options);

            listTitle = validListTitle(options);

            batch = createBatchXML(options);

            request = $.extend(true, defaults, params, {
                data: {
                    SiteUrl: siteUrl,
                    ListTitle: listTitle,
                    Batch: batch
                }
            });

            return fn.getPromise(request);
        }

        return processBatchData;

        function validOptions ( options ) {

            //Todo: check if passed in object has a supported format
            if ( !true ) {
                throw new Error('caps.processBatchData(). Invalid options');
            }

            return $.isArray(options) ? options : [options];
        }

        function validSiteUrl ( options ) {
            var baseUrl = L_Menu_BaseUrl ? L_Menu_BaseUrl : '',
                site = options[0].siteUrl ? options[0].siteUrl : baseUrl,
                path = site.replace(/^\/+|\/+$/g, '');

            if ( !path ) {
                throw new Error('caps.processBatchData(). Missing required "siteUrl" property and fallback method L_Menu_BaseUrl is undefined.');
            }

            return '%WebRoot%' + site;
        }

        function validListTitle ( options ) {
            var listTitle = '';

            listTitle = $.map(options,function( obj ) {
                return obj.listTitle;
            }).join(',');


            if ( !listTitle ) {
                throw new Error('caps.processBatchData(). Missing required "listTitle" property.');
            }

            return listTitle;
        }
    }
);
define('getListItems/index',['require','jquery','common','./convertFilter2Caml'],function( require ) {
        

        var $ = require('jquery'),
            fn = require('common'),
            convertFilter2Caml = require('./convertFilter2Caml'),
            L_Menu_BaseUrl = window.L_Menu_BaseUrl || null,
            defaults;

        defaults = {
            type: 'GET',
            data: {
                RequestType: 'GetListItems',
                OutputType: 'json'
            }
        };

        function getListItems ( options, params ) {
            var siteUrl, listTitle, data, request;

            options = validOptions(options);

            //Mandatory data properties
            data = {
                SiteUrl: validSiteUrl(options),
                ListTitle: validListTitle(options)
            };

            //todo: what about sort, paging, query options?
            if ( options.caml ) {
                data.CAML = validCaml(options);
            }

            request = $.extend(true, defaults, params, {
                data: data
            });

            return fn.getPromise(request);

        }

        return getListItems;

        function validOptions ( options ) {

            //Todo: check if passed in object has a supported format

            if ( !true ) {
                throw new Error('caps.getListItems(). Invalid options');
            }

            return options || {};
        }

        function validSiteUrl ( options ) {
            var baseUrl = L_Menu_BaseUrl ? L_Menu_BaseUrl : '',
                site = options.siteUrl ? options.siteUrl : baseUrl,
                path = site.replace(/^\/+|\/+$/g, '');

            if ( !path ) {
                throw new Error('caps.getListItems(). Missing required site property and fallback method L_Menu_BaseUrl is undefined.');
            }

            return '%WebRoot%/' + path;
        }

        function validListTitle ( options ) {

            if ( !options.listTitle ) {
                throw new Error('caps.getListItems(). Missing required title property');
            }

            return options.listTitle;
        }

        function validCaml ( options ) {
            var result = [],
                sortDir = true,
                PID = '',
                camlObj = options.caml;


            // filter require options.model.fields
            if ( camlObj.filter && !fn.checkNested(options.model.fields) ) {
                throw new Error('caps.getListItems({caml.filter: obj}). Missing required model.fields property.');
            }

            result.push('<Query>');

            if ( camlObj.sort ) {
                result.push(sortQuery(camlObj));
            }

            if ( camlObj.filter ) {
                var obj = {
                    filter: camlObj.filter,
                    fields: options.model.fields
                };

                result.push(convertFilter2Caml(obj));
            }

            result.push('</Query>');

//            if ( camlObj.pageSize ) {
//                   result.push(cn.format('<RowLimit>{0}</RowLimit>',
//                       camlObj.pageSize));
//            }


            result.push(queryOptions(camlObj));

            return result.join('');

            //Internal

            function sortQuery ( camlObj ) {
                var sort = [];

                camlObj.sort = $.isArray(camlObj.sort) ? camlObj.sort : [camlObj.sort];

                sort.push('<OrderBy>');

                $.each(camlObj.sort, function( index, sortObj ) {
                    sortDir = (sortObj.dir === 'asc');

                    sort.push(fn.format('<FieldRef Name="{0}" Ascending="{1}"/>',
                        sortObj.field,
                        sortDir)
                    );
                });

                sort.push('</OrderBy>');

                return sort.join('');
            }

            function queryOptions (camlObj) {
                var query = [];


                //todo: QueryOption JSON format?
                query.push('<QueryOptions>');
                query.push('<DateInUtc>True</DateInUtc>');
                query.push('<ExpandUserField>True</ExpandUserField>');

                //todo: Should paging support be build into caps?
                query.push('</QueryOptions>');


                return query.join('');
            }

        }

    }
);
define('getListInfo/index',['require','jquery','common'],function( require ) {
        

        var $ = require('jquery'),
            fn = require('common'),
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

            return fn.getPromise(request);

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

            // GetListInfo returns info for all lists if called without listTitle
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
define('caps',['require','jquery','common','events','processBatchData/createBatchXML','getListItems/convertFilter2Caml','events/index','polyfills','processBatchData/index','getListItems/index','getListInfo/index'],function( require ) {
        
        var $ = require('jquery'),
            common = require('common'),
            events = require('events'),
            version = '0.10.4',
            fn;

        // fn mixIns to common methods
        fn = mixIn({
            createBatchXML: require('processBatchData/createBatchXML'),
            convertFilter2Caml: require('getListItems/convertFilter2Caml'),

            //Including the Events constructor NOT the global events object
            Events:  require('events/index')
        });

        // Loading ECMA 5 polyfills
        require('polyfills');

        // Return public API
        return  {
            version: version,
            processBatchData: require('processBatchData/index'),
            getListItems: require('getListItems/index'),
            getListInfo: require('getListInfo/index'),
            fn: fn,
            events: events
        };

        //Internal
        function mixIn ( obj ) {
            return $.extend({}, common, obj);
        }
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
