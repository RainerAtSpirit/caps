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

    describe("fn", function() {

        describe("Events", function() {

            it("should be a function", function() {
                expect(typeof caps.fn.Events).toBe('function');
            });

        });

        describe("checkNested", function() {

            it("should be a function", function() {
                expect(typeof caps.fn.checkNested).toBe('function');
            });

        });

        describe("convert2Caml", function() {

            it("should be a function", function() {
                expect(typeof caps.fn.convert2Caml).toBe('function');
            });

        });

        describe("convertFilter2Caml", function() {

            it("should be a function", function() {
                expect(typeof caps.fn.convertFilter2Caml).toBe('function');
            });

        });

        describe("createBatchXML", function() {

            it("should be a function", function() {
                expect(typeof caps.fn.createBatchXML).toBe('function');
            });

        });

        describe("format", function() {

            it("should be a function", function() {
                expect(typeof caps.fn.format).toBe('function');
            });

        });

        describe("getPromise", function() {

            it("should be a function", function() {
                expect(typeof caps.fn.getPromise).toBe('function');

            });
        });

        describe("getSiteUrl", function() {

            it("should be a function", function() {
                expect(typeof caps.fn.getSiteUrl).toBe('function');
            });

        });

        describe("version", function() {

            it("should be a string", function() {
                expect(typeof caps.fn.string).toBe('string');
            });

        });

    });

    describe("processBatchData", function() {

        it("should be a function", function() {
            expect(typeof caps.processBatchData).toBe('function');
        });

    });

    describe("caps events", function() {

        it(".on should be a function", function() {
            expect(typeof caps.on).toBe('function');
        });

        it(".off should be a function", function() {
            expect(typeof caps.off).toBe('function');
        });

        it(".proxy should be a function", function() {
            expect(typeof caps.proxy).toBe('function');
        });

        it(".trigger should be a function", function() {
            expect(typeof caps.trigger).toBe('function');
        });

    });
});
