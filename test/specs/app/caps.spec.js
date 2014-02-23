/*global jasmine, describe, beforeEach, it, expect, require, EquivalentXml, loadJSONFixtures */
/**
 * caps.spec.js tests the public interface NOT the functionality.
 */

describe("caps", function() {
    "use strict";

    var caps = window.caps;

    it("should be object", function() {
        expect(typeof caps).toBe('object');
    });

    describe("processBatchData", function() {

        it("should be a function", function() {
            expect(typeof caps.processBatchData).toBe('function');
        });

        it("should have an alias of ProcessBatchData", function() {
            expect(caps.processBatchData).toBe(caps.ProcessBatchData);
        });

        describe("createBatchXML", function() {

            it("should be a function", function() {
                expect(typeof caps.ProcessBatchData.createBatchXML).toBe('function');
            });

        });
    });

    describe("batchRequest", function() {

        it("should be a function", function() {
            expect(typeof caps.BatchRequest).toBe('function');
        });

        it("should have an alias of BatchRequest", function() {
            expect(caps.batchRequest).toBe(caps.BatchRequest);
        });
    });

});
