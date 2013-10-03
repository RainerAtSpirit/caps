/*global jasmine, describe, beforeEach, it, expect, require, EquivalentXml, loadJSONFixtures */
describe('CreateBatchXML AMD', function() {
    "use strict";

    var CreateBatchXML = require('processBatchData/createBatchXML');
    var createBatchXML = new CreateBatchXML();

    jasmine.getJSONFixtures().fixturesPath = 'test/_fixtures';
    jasmine.getFixtures().fixturesPath = 'test/_fixtures';

    beforeEach(function() {
        this.addMatchers(EquivalentXml.jasmine);
    });

    describe("createBatchXML", function() {

        it("should be a object", function() {
            expect(typeof createBatchXML).toBe('object');
        });

        describe("create", function() {
            it("should be a function", function() {
                expect(typeof createBatchXML.create).toBe('function');
            });

            describe("should convert single item JSON format", function() {
                var fixtures, batchXML, resultXML, json, result;

                beforeEach(function() {
                    batchXML = resultXML = "";
                    fixtures = loadJSONFixtures('test.json');
                    json = fixtures['test.json'].singleItem.json;
                    result = fixtures['test.json'].singleItem.xml;
                });

                it("single", function() {
                    batchXML = EquivalentXml.xml(createBatchXML.create(json));
                    resultXML = EquivalentXml.xml(result);

                    expect(batchXML).beEquivalentTo(resultXML);
                });

            });

        });
    });
});
