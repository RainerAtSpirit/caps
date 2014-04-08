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

    });

    describe("batchRequest", function() {

        it("should be a function", function() {
            expect(typeof caps.batchRequest).toBe('function');
        });

    });

    describe("checkVariables", function() {

        it("should be a function", function() {
            expect(typeof caps.checkVariables).toBe('function');
        });

    });

    describe("copyFile", function() {

        it("should be a function", function() {
            expect(typeof caps.copyFile).toBe('function');
        });

    });

    describe("createPage", function() {

        it("should be a function", function() {
            expect(typeof caps.createPage).toBe('function');
        });

    });

    describe("executeAction", function() {

        it("should be a function", function() {
            expect(typeof caps.executeAction).toBe('function');
        });

    });

    describe("getActionDefinitions", function() {

        it("should be a function", function() {
            expect(typeof caps.getActionDefinitions).toBe('function');
        });

    });

    describe("getActivatedSolutions", function() {

        it("should be a function", function() {
            expect(typeof caps.getActivatedSolutions).toBe('function');
        });

    });

    describe("getCentralViewData", function() {

        it("should be a function", function() {
            expect(typeof caps.getCentralViewData).toBe('function');
        });

    });

    describe("getContentTypes", function() {

        it("should be a function", function() {
            expect(typeof caps.getContentTypes).toBe('function');
        });

    });

    describe("getFileContents", function() {

        it("should be a function", function() {
            expect(typeof caps.getFileContents).toBe('function');
        });

    });

    describe("getGlobalVariables", function() {

        it("should be a function", function() {
            expect(typeof caps.getGlobalVariables).toBe('function');
        });

    });

    describe("getListInfo", function() {

        it("should be a function", function() {
            expect(typeof caps.getListInfo).toBe('function');
        });

    });

    describe("getListItems", function() {

        it("should be a function", function() {
            expect(typeof caps.getListItems).toBe('function');
        });

    });

    describe("getServerInfo", function() {

        it("should be a function", function() {
            expect(typeof caps.getServerInfo).toBe('function');
        });

    });

    describe("getSiteCollections", function() {

        it("should be a function", function() {
            expect(typeof caps.getSiteCollections).toBe('function');
        });

    });

    describe("getSiteInfo", function() {

        it("should be a function", function() {
            expect(typeof caps.getSiteInfo).toBe('function');
        });

    });

    describe("getSiteUsers", function() {

        it("should be a function", function() {
            expect(typeof caps.getSiteUsers).toBe('function');
        });

    });

    describe("getVersion", function() {

        it("should be a function", function() {
            expect(typeof caps.getVersion).toBe('function');
        });

    });

    describe("getWebPartPageTemplates", function() {

        it("should be a function", function() {
            expect(typeof caps.getWebPartPageTemplates).toBe('function');
        });

    });

    describe("getWebPartProperties", function() {

        it("should be a function", function() {
            expect(typeof caps.getWebPartProperties).toBe('function');
        });

    });

    describe("processBatchData", function() {

        it("should be a function", function() {
            expect(typeof caps.processBatchData).toBe('function');
        });

    });

    describe("processGlobalVariables", function() {

        it("should be a function", function() {
            expect(typeof caps.processGlobalVariables).toBe('function');
        });

    });

    describe("processList", function() {

        it("should be a function", function() {
            expect(typeof caps.processList).toBe('function');
        });

    });

    describe("startWorkflow", function() {

        it("should be a function", function() {
            expect(typeof caps.startWorkflow).toBe('function');
        });

    });

    describe("events", function() {

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

    describe("version", function() {

        it("should be a string", function() {
            expect(typeof caps.version).toBe('string');
        });

    });
});
