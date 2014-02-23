/*global jasmine, describe, beforeEach, it, expect, require, EquivalentXml, loadJSONFixtures */
describe('getListItems module', function() {
    "use strict";

    var convert = require('getListItems/convertFilter2Caml'),
        options;

    jasmine.getJSONFixtures().fixturesPath = 'test/_fixtures';
    jasmine.getFixtures().fixturesPath = 'test/_fixtures';

    beforeEach(function() {
        this.addMatchers(EquivalentXml.jasmine);
    });

    describe("convertFilter2Caml", function() {

        it("should be an function", function() {
            expect(typeof convert).toBe('function');
        });

        describe("single filter expression", function() {
           var fixtures, batchXML, resultXML, json, jsonFilter, camlResult, filterOption, convertedXML;

           beforeEach(function() {
               batchXML = resultXML = "";
               fixtures = loadJSONFixtures('caml.json');
               options = fixtures['caml.json'].options;
               jsonFilter = fixtures['caml.json'].single.filter;
               camlResult = fixtures['caml.json'].single.caml;
           });

        it('should convert single expressions like: Title startswith T ', function () {

         filterOption = $.extend({}, options, { filter: jsonFilter });
         convertedXML = EquivalentXml.xml(convert(filterOption));
         resultXML = EquivalentXml.xml(camlResult);

         expect(convertedXML).beEquivalentTo(resultXML);
       });


       });

    });
});
