/*global jasmine, describe, beforeEach, it, expect, require */
describe('caps AMD', function() {
    "use strict";

    var caps = require('caps');

    it('should have a version number', function() {
        expect(caps.version).toBeDefined();
    });

    it('should have settings object', function() {
        expect(typeof caps.settings).toBe('object');
    });


    it('should have a processBatchData function', function() {
        expect(typeof caps.processBatchData).toBe('function');
    });

    it('should have batchRequest function', function() {
          expect(typeof caps.batchRequest).toBe('function');
      });

});
