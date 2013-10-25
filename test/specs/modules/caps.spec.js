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

    it('should have a fn object', function() {
        expect(typeof caps.fn).toBe('object');
    });

    it('should have a ProcessBatchData function', function() {
        expect(typeof caps.ProcessBatchData).toBe('function');
    });

    it('should have a BatchRequest object', function() {
          expect(typeof caps.BatchRequest).toBe('function');
      });

});
