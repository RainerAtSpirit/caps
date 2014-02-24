/*global jasmine, describe, beforeEach, it, expect, require, EquivalentXml, loadJSONFixtures */
describe('getListItems module', function() {
    "use strict";

    var convert = require('getListItems/convertFilter2Caml'),
        fixtures, expressions, resultXML, json, jsonFilter, camlResult, filterOption, convertedXML, options;

    jasmine.getJSONFixtures().fixturesPath = 'test/_fixtures';
    jasmine.getFixtures().fixturesPath = 'test/_fixtures';


    describe("convertFilter2Caml", function() {
        fixtures = loadJSONFixtures('caml.json');
        options = fixtures['caml.json'].options;


        beforeEach(function() {
            jsonFilter = camlResult = "";
            this.addMatchers(EquivalentXml.jasmine);
        });

        it("should be a function", function() {
            expect(typeof convert).toBe('function');
        });

        describe("should convert single filter expression like:", function() {

            beforeEach(function() {
                expressions = fixtures['caml.json'].expressions.one;
            });

            it('Title startswith T', function() {
                useFixture('startswith');

                expect(convertedXML).beEquivalentTo(resultXML);
            });

            it('A OR B OR C', function() {
                useFixture('AorBorC');

                expect(convertedXML).beEquivalentTo(resultXML);
            });

            it('Title startswith T AND contains 4', function() {
                useFixture('AandB');

                expect(convertedXML).beEquivalentTo(resultXML);
            });

            it('Title startswith a OR b OR c OR d OR e', function() {
                useFixture('AorBorCorD');

                expect(convertedXML).beEquivalentTo(resultXML);
            });
        });

        describe("should convert two filter expression like:", function() {

            beforeEach(function() {
                expressions = fixtures['caml.json'].expressions.two;
            });

            it('(A OR B) AND C', function() {
                useFixture('AorB_AndC');

                expect(convertedXML).beEquivalentTo(resultXML);
            });

            it('A AND (B or C)', function() {
                useFixture('Aand_BorC');

                expect(convertedXML).beEquivalentTo(resultXML);
            });

            it('(A or B or C) and D', function() {
                useFixture('AorBorC_AndD');

                expect(convertedXML).beEquivalentTo(resultXML);
            });

        });

        describe("should convert three filter expression like:", function() {

            beforeEach(function() {
                expressions = fixtures['caml.json'].expressions.three;
            });

            it('(A or B) OR (C OR D) Or (E Or F)', function() {
                useFixture('AorB_OrCorD_OrEorF');

                expect(convertedXML).beEquivalentTo(resultXML);
            });
        });
    });

    function useFixture ( node ) {
        jsonFilter = expressions[node].filter;
        camlResult = expressions[node].caml;
        filterOption = $.extend({}, options, { filter: jsonFilter });
        convertedXML = EquivalentXml.xml(convert(filterOption));
        resultXML = EquivalentXml.xml(camlResult);
    }
});
