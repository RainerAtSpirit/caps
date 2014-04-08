var caps =
/******/ (function(modules) { // webpackBootstrap
/******/ 	
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/ 		
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/ 		
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 		
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 		
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/ 	
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ 	
/******/ 	
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Caps main module that defines the public API
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';

	        var Events = __webpack_require__(1),
	            version = '0.31.1',
	            caps;

	        // ECMA 5 polyfills
	        __webpack_require__(3);

	        caps = {
	            fn: __webpack_require__(2),
	            version: version,
	            checkVariables: __webpack_require__(4),
	            getActionDefinitions: __webpack_require__(5),
	            getActivatedSolutions: __webpack_require__(6),
	            getContentTypes: __webpack_require__(7),
	            getFileContents: __webpack_require__(8),
	            getGlobalVariables: __webpack_require__(9),
	            getListInfo: __webpack_require__(10),
	            getListItems: __webpack_require__(11),
	            getServerInfo: __webpack_require__(12),
	            getSiteCollection: __webpack_require__(13),
	            getSiteInfo: __webpack_require__(14),
	            getSiteUsers: __webpack_require__(15),
	            getVersion: __webpack_require__(16),
	            getWebPartPageTemplates: __webpack_require__(17),
	            getWebPartProperties: __webpack_require__(18),
	            processBatchData: __webpack_require__(19)
	        };

	        // Add events in caps name space
	        Events.includeIn(caps);

	        // caps API
	        return  caps;
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Based on Durandal http://www.durandaljs.com 2.0 events module
	 * Durandal events originate from backbone.js but also combine some ideas from signals.js as well as some additional improvements.
	 * caps.fn.Events can be installed into any object, but they are not installed by default.
	 * @module events
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	    "use strict";
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
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	    'use strict';

	    var fn;

	    // extend common methods with methods available at caps.fn namespace
	    fn = $.extend({}, __webpack_require__(20), {
	        createBatchXML: __webpack_require__(21),
	        convert2Caml: __webpack_require__(22),
	        convertFilter2Caml: __webpack_require__(23),
	        Events: __webpack_require__(1)
	    });

	    return fn;
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
	    'use strict';

	    //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
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
	    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
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
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';

	        var params = __webpack_require__(25),
	            fn = __webpack_require__(20),
	            validate = __webpack_require__(24),
	            defaults;

	        defaults = {
	            type: 'GET',
	            data: {
	                RequestType: 'CheckVariables',
	                OutputType: 'json'
	            }
	        };

	        /**
	         *
	         * @param options {object} getActionDefinitions configuration object
	         * @param params {object} ajax settings overwriting defaults and options
	         * @returns {*} promise
	         */
	        function checkVariables ( options, params ) {
	            options = options || {};

	            var request;

	            request = $.extend(true, {}, defaults, {
	                data: {

	                }
	            }, params);

	            return fn.getPromise(request);
	        }

	        return checkVariables;
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';

	        var fn = __webpack_require__(20),
	            validate = __webpack_require__(24),
	            defaults;

	        defaults = {
	            type: 'GET',
	            data: {
	                RequestType: 'GetActionDefinitions',
	                OutputType: 'json',
	                DetailLevels: 1
	            }
	        };

	        /**
	         *
	         * @param options {object} getActionDefinitions configuration object
	         * @param params {object} ajax settings overwriting defaults and options
	         * @returns {*} promise
	         */
	        function getActionDefinitions ( options, params ) {
	            options = options || {};

	            var request;

	            request = $.extend(true, {}, defaults, {
	                data: {
	                    SiteUrl: validate.getSiteUrl(options.siteUrl, 'getActionDefinitions'),
	                    ListTitle: validate.getListTitle(options.listTitle)
	                }
	            }, params);

	            return fn.getPromise(request);
	        }

	        return getActionDefinitions;
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';

	        var fn = __webpack_require__(20),
	            validate = __webpack_require__(24),
	            defaults;

	        defaults = {
	            type: 'GET',
	            data: {
	                RequestType: 'GetActivatedSolutions',
	                OutputType: 'json'
	            }
	        };

	        /**
	         *
	         * @param options {object} getActivatedSolutions configuration object
	         * @param params {object} ajax settings overwriting defaults and options
	         * @returns {*} promise
	         */
	        function getActivatedSolutions ( options, params ) {
	            options = options || {};

	            var request;

	            request = $.extend(true, {}, defaults, {
	                SiteUrl: validate.getSiteUrl(options.siteUrl, 'getActivatedSolutions')
	            }, params);

	            return fn.getPromise(request);
	        }

	        return getActivatedSolutions;
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';

	        var capsParams = __webpack_require__(25),
	            fn = __webpack_require__(20),
	            validate = __webpack_require__(24),
	            defaults;

	        defaults = {
	            type: 'GET',
	            data: {
	                RequestType: 'GetContentTypes',
	                OutputType: 'json'
	            }
	        };

	        /**
	         *
	         * @param options {object} getContentTypes configuration object
	         * @param params {object} ajax settings overwriting defaults and options
	         * @returns {*} promise
	         */
	        function getContentTypes ( options, params ) {
	            options = options || {};

	            var request, data,
	                optional = capsParams.getContentTypes.optional;

	            // Adding required properties
	            data = {

	            };

	            data = validate.addOptionalProperties(options, data, optional);

	            request = $.extend(true, {}, defaults, {
	                data: data
	            }, params);


	            return fn.getPromise(request);
	        }

	        return getContentTypes;
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';

	        var capsParams = __webpack_require__(25),
	            fn = __webpack_require__(20),
	            validate = __webpack_require__(24),
	            defaults;

	        defaults = {
	            type: 'GET',
	            data: {
	                RequestType: 'GetFileContents',
	                OutputType: 'json'
	            }
	        };

	        /**
	         *
	         * @param options {object} getFileContents configuration object
	         * @param params {object} ajax settings overwriting defaults and options
	         * @returns {*} promise
	         */
	        function getFileContents ( options, params ) {
	            options = options || {};

	            var request, data,
	                optional = capsParams.getFileContents.optional;

	            // Adding required properties
	            data = {
	                FileUrl: validate.getRequiredParam('fileUrl', options.fileUrl, 'getFileContents')
	            };

	            data = validate.addOptionalProperties(options, data, optional);

	            request = $.extend(true, {}, defaults, {
	                data: data
	            }, params);


	            return fn.getPromise(request);
	        }

	        return getFileContents;
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';

	        var fn = __webpack_require__(20),
	            validate = __webpack_require__(24),
	            defaults;

	        defaults = {
	            type: 'GET',
	            data: {
	                RequestType: 'GetGlobalVariables',
	                OutputType: 'json'
	            }
	        };

	        /**
	         *
	         * @param options {object} getGlobalVariables configuration object
	         * @param params {object} ajax settings overwriting defaults and options
	         * @returns {*} promise
	         */
	        function getGlobalVariables ( options, params ) {
	            options = options || {};

	            var request;

	            request = $.extend(true, {}, defaults, {
	                data: {

	                }
	            }, params);

	            return fn.getPromise(request);
	        }

	        return getGlobalVariables;
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';

	        var fn = __webpack_require__(20),
	            validate = __webpack_require__(24),
	            defaults;

	        defaults = {
	            type: 'GET',
	            data: {
	                RequestType: 'GetListInfo',
	                OutputType: 'json'
	            }
	        };

	        /**
	         *
	         * @param options {object} getListInfo configuration object
	         * @param params {object} ajax settings overwriting defaults and options
	         * @returns {*} promise
	         */
	        function getListInfo ( options, params ) {
	            options = options || {};

	            var request, data,
	                optional = ['listTitle', 'properties'];

	            // Adding mandatory properties
	            data = {
	                SiteUrl: validate.getSiteUrl(options.siteUrl, 'getListInfo')
	            };

	            data = validate.addOptionalProperties(options, data, optional);

	            request = $.extend(true, {}, defaults, {
	                data: data
	            }, params);


	            return fn.getPromise(request);
	        }

	        return getListInfo;
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';

	        var fn = __webpack_require__(20),
	            validate = __webpack_require__(24),
	            convert2Caml = __webpack_require__(22),
	            defaults;

	        defaults = {
	            type: 'GET',
	            data: {
	                RequestType: 'GetListItems',
	                OutputType: 'json'
	            }
	        };

	        /**
	         *
	         * @param options {object} getListItems configuration object
	         * @param params {objects} ajax settings overwriting defaults and options
	         * @returns {*} promise
	         */
	        function getListItems ( options, params ) {
	            options = options || {};

	            var data, request;

	            data = {
	                SiteUrl: validate.getSiteUrl(options.siteUrl, 'getListItems'),
	                ListTitle: validate.getListTitle(options.listTitle, 'getListItems')
	            };

	            if ( options.caml ) {
	                data.CAML = convert2Caml(options.caml, options.model);
	            }

	            request = $.extend(true, {}, defaults, {
	                data: data
	            }, params);

	            return fn.getPromise(request);
	        }

	        return getListItems;
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';

	        var fn = __webpack_require__(20),
	            validate = __webpack_require__(24),
	            defaults;

	        defaults = {
	            type: 'GET',
	            data: {
	                RequestType: 'GetServerInfo',
	                OutputType: 'json'
	            }
	        };

	        /**
	         *
	         * @param options {object} getServerInfo configuration object
	         * @param params {object} ajax settings overwriting defaults and options
	         * @returns {*} promise
	         */
	        function getServerInfo ( options, params ) {
	            options = options || {};

	            var request;

	            request = $.extend(true, {}, defaults, {
	                data: {

	                }
	            }, params);

	            return fn.getPromise(request);
	        }

	        return getServerInfo;
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';

	        var fn = __webpack_require__(20),
	            validate = __webpack_require__(24),
	            defaults;

	        defaults = {
	            type: 'GET',
	            data: {
	                RequestType: 'GetSiteCollection',
	                OutputType: 'json'
	            }
	        };

	        /**
	         *
	         * @param options {object} getSiteCollection configuration object
	         * @param params {object} ajax settings overwriting defaults and options
	         * @returns {*} promise
	         */
	        function getSiteCollection ( options, params ) {
	            options = options || {};

	            var request;

	            request = $.extend(true, {}, defaults, {
	                data: {

	                }
	            }, params);

	            return fn.getPromise(request);
	        }

	        return getSiteCollection;
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';

	        var fn = __webpack_require__(20),
	            validate = __webpack_require__(24),
	            defaults;

	        defaults = {
	            type: 'GET',
	            data: {
	                RequestType: 'GetSiteInfo',
	                OutputType: 'json'
	            }
	        };

	        /**
	         *
	         * @param options {object} getSiteInfo configuration object
	         * @param params {object} ajax settings overwriting defaults and options
	         * @returns {*} promise
	         */
	        function getSiteInfo ( options, params ) {
	            options = options || {};

	            var request,
	                data = {},
	                optional = ['properties'];

	            data = validate.addOptionalProperties(options, data, optional);

	            request = $.extend(true, {}, defaults, {
	                data:  data
	            }, params);

	            return fn.getPromise(request);
	        }

	        return getSiteInfo;
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';

	        var fn = __webpack_require__(20),
	            validate = __webpack_require__(24),
	            defaults;

	        defaults = {
	            type: 'GET',
	            data: {
	                RequestType: 'GetSiteUser',
	                OutputType: 'json'
	            }
	        };

	        /**
	         *
	         * @param options {object} getSiteUsers configuration object
	         * @param params {object} ajax settings overwriting defaults and options
	         * @returns {*} promise
	         */
	        function getSiteUsers ( options, params ) {
	            options = options || {};

	            var request;

	            request = $.extend(true, {}, defaults, {
	                data: {

	                }
	            }, params);

	            return fn.getPromise(request);
	        }

	        return getSiteUsers;
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';

	        var fn = __webpack_require__(20),
	            validate = __webpack_require__(24),
	            defaults;

	        defaults = {
	            type: 'GET',
	            data: {
	                RequestType: 'GetVersion',
	                OutputType: 'json'
	            }
	        };

	        /**
	         *
	         * @param options {object} getVersion configuration object
	         * @param params {object} ajax settings overwriting defaults and options
	         * @returns {*} promise
	         */
	        function getVersion ( options, params ) {
	            options = options || {};

	            var request;

	            request = $.extend(true, {}, defaults, {
	                data: {

	                }
	            }, params);

	            return fn.getPromise(request);
	        }

	        return getVersion;
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';

	        var fn = __webpack_require__(20),
	            validate = __webpack_require__(24),
	            defaults;

	        defaults = {
	            type: 'GET',
	            data: {
	                RequestType: 'GetWebPartPageTemplates',
	                OutputType: 'json'
	            }
	        };

	        /**
	         *
	         * @param options {object} getWebPartPageTemplates configuration object
	         * @param params {object} ajax settings overwriting defaults and options
	         * @returns {*} promise
	         */
	        function getWebPartPageTemplates ( options, params ) {
	            options = options || {};

	            var request;

	            request = $.extend(true, {}, defaults, {
	                data: {

	                }
	            }, params);

	            return fn.getPromise(request);
	        }

	        return getWebPartPageTemplates;
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';

	        var fn = __webpack_require__(20),
	            validate = __webpack_require__(24),
	            defaults;

	        defaults = {
	            type: 'GET',
	            data: {
	                RequestType: 'GetWebPartProperties',
	                OutputType: 'json'
	            }
	        };

	        /**
	         *
	         * @param options {object} getWebPartProperties configuration object
	         * @param params {object} ajax settings overwriting defaults and options
	         * @returns {*} promise
	         */
	        function getWebPartProperties ( options, params ) {
	            options = options || {};

	            var request;

	            request = $.extend(true, {}, defaults, {
	                data: {

	                }
	            }, params);

	            return fn.getPromise(request);
	        }

	        return getWebPartProperties;
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';

	        var fn = __webpack_require__(20),
	            validate = __webpack_require__(24),
	            createBatchXML = __webpack_require__(21),
	            defaults;

	        defaults = {
	            type: 'POST',
	            data: {
	                RequestType: 'ProcessBatchData',
	                OutputType: 'json'
	            }
	        };

	        /**
	         *
	         * @param options {object} processBatchData configuration object
	         * @param params {object} ajax settings overwriting defaults and options
	         * @returns {*} promise
	         */
	        function processBatchData ( options, params ) {
	            options = options || {};

	            var siteUrl, listTitle, batch, request;

	            siteUrl = validate.getSiteUrl(options.siteUrl, 'processBatchData');

	            listTitle = getListTitle(options);

	            batch = createBatchXML(validateBatch(options));

	            request = $.extend(true, {}, defaults, {
	                data: {
	                    SiteUrl: siteUrl,
	                    ListTitle: listTitle,
	                    Batch: batch
	                }
	            }, params);

	            return fn.getPromise(request);
	        }

	        return processBatchData;

	        //Internal
	        function getListTitle ( options ) {
	            var listTitle = '';

	            listTitle = $.map(options,function( obj ) {
	                return obj.listTitle;
	            }).join(',');

	            if ( !listTitle ) {
	                throw new Error('caps.processBatchData(). Missing required "listTitle" property.');
	            }

	            return listTitle;
	        }

	        function validateBatch ( options ) {

	            if ( !options && !options.batch ) {
	                throw new Error('caps.processBatchData(). Missing required "batch" property.');
	            }

	            return options.batch;
	        }
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* global caps */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	    'use strict';

	    var L_Menu_BaseUrl = window.L_Menu_BaseUrl;

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

	        var urlCaps = '/_layouts/CorasWorksApps/CorasWorksApplicationService.ashx',
	            url = options.url || urlCaps,
	            request,
	            defaults = {
	                data: null,
	                dataType: 'json'
	            };

	        // Clean up
	        if ( options.url ) {
	            delete options.url;
	        }

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
	        var soapEnv = '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><{0} xmlns="http://schemas.microsoft.com/sharepoint/soap/" >{1}</{0}></soap:Body></soap:Envelope>',
	            pathName = location.pathname.toLocaleLowerCase(),
	            siteName = '',
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

	        // last resort using webs.amsx with async false!

	        pageUrl = format('<pageUrl>{0}</pageUrl>', location.href.split('?')[0]);

	        $.ajax('/_vti_bin/Webs.asmx', {
	            async: false,
	            type: 'POST',
	            dataType: 'xml',
	            data: format(soapEnv, 'WebUrlFromPageUrl', pageUrl),
	            contentType: 'text/xml; charset="utf-8"'
	        })
	            .complete(function( response ) {
	                siteName = $(response.responseXML).find("WebUrlFromPageUrlResult").text();
	            });

	        return siteName;
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
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';
	        var fn = __webpack_require__(20);


	        function createBatchXML ( options ) {
	                options = $.isArray(options) ? options : [options];

	                var i,
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
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';

	        var fn = __webpack_require__(20),
	            convertFilter2Caml = __webpack_require__(23);

	        /**
	         *
	         * @param caml {object} caml configuration
	         * @param model {object} model object required by caml.filter
	         * @returns {string}
	         */
	        function convertCaml ( caml, model ) {
	            model = model || {};

	            var result = [], fields;

	            // filter require options.model.fields
	            if ( caml.filter && (!model || !fn.checkNested(model.fields)) ) {
	                throw new Error('caps.getListItems({caml.filter}). Required param model.fields missing.');
	            }

	            result.push(getQuery(caml.sort, caml.filter, model.fields));

	            result.push(getViewFields(caml.viewFields));

	            result.push(getRowLimit(caml.rowLimit));

	            result.push(getQueryOptions(caml.queryOptions));

	            return result.join('');

	        }

	        return convertCaml;

	        //Internal
	        function getRowLimit ( rowLimit ) {
	            var result = "";

	            if ( rowLimit ) {
	                result = fn.format('<RowLimit>{0}</RowLimit>',
	                    rowLimit);
	            }

	            return result;
	        }

	        function getQuery ( sort, filter, fields ) {
	            var result = [];
	            result.push('<Query>');

	            if ( sort ) {
	                result.push(getOrderBy(sort));
	            }

	            if ( filter ) {
	                result.push(convertFilter2Caml(filter, fields));
	            }

	            result.push('</Query>');

	            return result.join('');

	            function getOrderBy ( sort ) {
	                var result = [];

	                sort = typeof sort === 'string' ? JSON.parse(sort) : sort;

	                sort = $.isArray(sort) ? sort : [sort];

	                result.push('<OrderBy>');

	                $.each(sort, function( index, sortObj ) {
	                    var sortDir = (sortObj.dir === 'asc');

	                    result.push(fn.format('<FieldRef Name="{0}" Ascending="{1}"/>',
	                        sortObj.field,
	                        sortDir)
	                    );
	                });

	                result.push('</OrderBy>');

	                return result.join('');
	            }

	        }

	        function getViewFields ( viewFields ) {
	            var result = [];

	            if ( !viewFields ) {
	                return '';
	            }

	            viewFields = $.isArray(viewFields) ? viewFields : viewFields.split(',');

	            result.push('<ViewFields>');

	            $.each(viewFields, function( index, field ) {

	                result.push(fn.format('<FieldRef Name="{0}" />',
	                    $.trim(field))
	                );
	            });

	            result.push('</ViewFields>');

	            return result.join('');
	        }

	        function getQueryOptions ( queryOptions ) {
	            var result = [],
	                settings,
	                defaults;

	            // Todo: Add getter/setter
	            // http://msdn.microsoft.com/en-us/library/dd966064%28v=office.12%29.aspx
	            defaults = {
	                /*     DateInUtc: null,
	                 Folder: null,
	                 Paging: null,
	                 IncludeMandatoryColumns: null,
	                 MeetingInstanceID: null,
	                 ViewAttributes: null,
	                 RecurrencePatternXMLVersion: null,
	                 RecurrenceOrderBy: null,
	                 IncludePermissions: null,
	                 ExpandUserField: null,
	                 IncludeAttachmentUrls: null,
	                 IncludeAttachmentVersion: null,
	                 RemoveInvalidXmlCharacters: null,
	                 OptimizeFor: null,
	                 ExtraIds: null,
	                 OptimizeLookups: null*/
	            };

	            settings = $.extend({}, defaults, queryOptions);

	            result.push('<QueryOptions>');

	            $.each(settings, function( prop, value ) {

	                if ( prop === 'Paging' ) {

	                    // Checking if "&" replacement was already applied

	                    if ( value.indexOf('&amp;amp;') === -1 ) {
	                        value = value.replace(/&/g, '&amp;amp;');
	                    }

	                    //value = encodeURIComponent(value);

	                    result.push(fn.format('<{0} ListItemCollectionPositionNext="{1}"/>', prop, value));

	                    return;
	                }

	                // Handling special case Document libraries
	                // http://msdn.microsoft.com/en-us/library/lists.lists.getlistitems(v=office.12).aspx
	                if ( prop === 'ViewAttributes' ) {

	                    if (value.indexOf('Recursive') > -1 ){
	                        result.push(fn.format('<{0} Scope="Recursive"/>', prop, value));
	                    }

	                    return;
	                }

	                result.push(fn.format('<{0}>{1}</{0}>', prop, value));

	            });

	            //todo: Should paging support be build into caps?
	            result.push('</QueryOptions>');

	            return result.join('');
	        }

	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));



/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	        'use strict';
	        var fn = __webpack_require__(20),
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

	        function convertFilter2Caml ( filter, fields ) {
	            var where = [],
	                caml = [];

	            if ( !filter ) {
	                throw new Error('caps.convertFilter2Caml(). Missing required filter argument');
	            }

	            if ( !fields ) {
	                throw new Error('caps.convertFilter2Caml(). Missing required fields argument');
	             }

	            filter = typeof filter === 'string' ? JSON.parse(filter) : filter;
	            fields = typeof fields === 'string' ? JSON.parse(fields) : fields;
	           
	            where.push('<Where>');

	            if ( filter && filter.filters.length === 1 && filter.filters[0].field ) {
	                where.push(createExpression(filter.filters[0]));
	            }
	            else {
	                convertBinarySearchTree2Caml(filter);
	                where.push(caml.join(''));
	            }
	            where.push('</Where>');

	            return (where.join(''));

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
	                    type;

	                // Check if we got a valid fields definition
	                if ( !fields[filterObj.field] ) {
	                    throw new Error(fn.format('caps.convertFilter2Caml(). Missing model.fields defintion for {0}', filterObj.field));
	                }

	                type = fields[filterObj.field].Type;

	                return fn.format(filterExpr, operator, field, type, val);
	            }

	        }

	        return convertFilter2Caml;
	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));



/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*global caps */

	!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
	    'use strict';
	    var fn = __webpack_require__(20),
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
	}.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function( require ) {
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

	    }.call(exports, __webpack_require__, exports, module)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }
/******/ ])