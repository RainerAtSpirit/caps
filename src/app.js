define(function(require) {
    'use strict';

    var Events = require('events/index'),
        app = {};

    Events.includeIn(app);

    return app;
});