/*global jasmine, describe, beforeEach, it, expect, require, EquivalentXml, loadJSONFixtures */
describe('CreateBatchXML AMD', function() {
    "use strict";
    var batchRequest = require('batchRequest/index');

    describe("batchRequest", function() {

        it("should be a function", function() {
            expect(typeof batchRequest).toBe('function');
        });
    });
});
