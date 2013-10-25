/*global jasmine, describe, beforeEach, it, expect, require, EquivalentXml, loadJSONFixtures */

describe("caps", function() {
    "use strict";

    jasmine.getJSONFixtures().fixturesPath = 'test/_fixtures';
    jasmine.getFixtures().fixturesPath = 'test/_fixtures';

    var caps = window.caps;

    beforeEach(function() {
        this.addMatchers(EquivalentXml.jasmine);
    });

    it("should be object", function() {
        expect(typeof caps).toBe('object');
    });

    describe("fn", function() {

        it("should be a object", function() {
            expect(typeof caps.fn).toBe('object');
        });

        describe("checkNested", function() {
            it("should be a function", function() {
                expect(typeof caps.fn.checkNested).toBe('function');

            });
        });
    });

    describe("ProcessBatchData", function() {

        it("should be an object", function() {
            expect(typeof caps.ProcessBatchData).toBe('function');
        });

        describe("createBatchXML", function() {

            it("should be a function", function() {
                expect(typeof caps.ProcessBatchData.createBatchXML).toBe('function');
            });

            describe("process single item formats", function() {
                var fixtures, batchXML, resultXML, json, result;

                beforeEach(function() {
                    batchXML = resultXML = "";
                    fixtures = loadJSONFixtures('test.json');
                    json = fixtures['test.json'].singleItem.json;
                    result = fixtures['test.json'].singleItem.xml;
                });

                it("single", function() {
                    batchXML = EquivalentXml.xml(caps.ProcessBatchData.createBatchXML(json));
                    resultXML = EquivalentXml.xml(result);

                    expect(batchXML).beEquivalentTo(resultXML);
                });
            });
        });
    });

    describe("BatchRequest", function() {

        it("should be an object", function() {
            expect(typeof caps.BatchRequest).toBe('function');
        });
    });

});
