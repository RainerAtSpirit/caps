define(function(require) {
    'use strict';

    var Events = require('events/index'),
        events = {};

    Events.includeIn(events);

    return events;
});