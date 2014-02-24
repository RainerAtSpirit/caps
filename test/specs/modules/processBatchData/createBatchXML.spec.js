/*global jasmine, describe, beforeEach, it, expect, require, EquivalentXml, loadJSONFixtures */
describe('createBatchXML module', function() {
    "use strict";

    var createBatchXML = require('processBatchData/createBatchXML');

    jasmine.getJSONFixtures().fixturesPath = 'test/_fixtures';
    jasmine.getFixtures().fixturesPath = 'test/_fixtures';

    beforeEach(function() {
        this.addMatchers(EquivalentXml.jasmine);
    });

    describe("createBatchXML", function() {

        it("should be a function", function() {
            expect(typeof createBatchXML).toBe('function');
        });

        describe("create", function() {
            it("should be a function", function() {
                expect(typeof createBatchXML).toBe('function');
            });

            describe("single item JSON format", function() {
                var fixtures, batchXML, resultXML, json, result;

                beforeEach(function() {
                    batchXML = resultXML = "";
                    fixtures = loadJSONFixtures('test.json');
                    json = fixtures['test.json'].singleItem.json;
                    result = fixtures['test.json'].singleItem.xml;
                });

                it("should produce a valid batch xml", function() {
                    batchXML = EquivalentXml.xml(createBatchXML(json));
                    resultXML = EquivalentXml.xml(result);

                    expect(batchXML).beEquivalentTo(resultXML);
                });

            });

            describe("three items in a single list JSON format", function() {
                var fixtures, batchXML, resultXML, json, result;

                beforeEach(function() {
                    batchXML = resultXML = "";
                    fixtures = loadJSONFixtures('test.json');
                    json = fixtures['test.json'].threeItems.json;
                    result = fixtures['test.json'].threeItems.xml;
                });

                it("should produce a valid batch xml", function() {
                    batchXML = EquivalentXml.xml(createBatchXML(json));
                    resultXML = EquivalentXml.xml(result);

                    expect(batchXML).beEquivalentTo(resultXML);
                });

            });

            describe("three methods in a single list JSON format", function() {
                var fixtures, batchXML, resultXML, json, result;

                beforeEach(function() {
                    batchXML = resultXML = "";
                    fixtures = loadJSONFixtures('test.json');
                    json = fixtures['test.json'].threeMethods.json;
                    result = fixtures['test.json'].threeMethods.xml;
                });

                it("should produce a valid batch xml", function() {
                    batchXML = EquivalentXml.xml(createBatchXML(json));
                    resultXML = EquivalentXml.xml(result);

                    expect(batchXML).beEquivalentTo(resultXML);
                });

            });

            describe("two lists single methods three items JSON format", function() {
                          var fixtures, batchXML, resultXML, json, result;

                          beforeEach(function() {
                              batchXML = resultXML = "";
                              fixtures = loadJSONFixtures('test.json');
                              json = fixtures['test.json'].twolists3items.json;
                              result = fixtures['test.json'].twolists3items.xml;
                          });

                it("should produce a valid batch xml", function() {
                    batchXML = EquivalentXml.xml(createBatchXML(json));
                    resultXML = EquivalentXml.xml(result);

                    expect(batchXML).beEquivalentTo(resultXML);
                });

            });

        });
    });
});
