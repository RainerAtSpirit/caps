/*
 * Just write your Jasmine tests here
 */

jasmine.getJSONFixtures().fixturesPath = 'test/fixtures';
jasmine.getFixtures().fixturesPath = 'test/fixtures';

var caps = window.caps;

beforeEach(function () {
  this.addMatchers(EquivalentXml.jasmine);
});


describe("caps", function() {

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

    describe("createBatchMethod", function() {

        it("should be a function", function() {
            expect(typeof caps.createBatchMethod).toBe('function');
        });

        describe("process single item formats", function() {
            var fixtures, batchXML, resultXML;
            var result = '' +
                '<Batch>' +
                    '<ows:Batch OnError="Continue"  xmlns:ows="http://www.corasworks.net/2012/ows">' +
                        '<Method ID="1,Update,Wizard">' +
                            '<SetList>%Wizard%</SetList>' +
                            '<SetVar Name="Cmd">Save</SetVar>' +
                            '<SetVar Name="ID">1</SetVar>' +
                            '<SetVar Name="urn:schemas-microsoft-com:office:office#Title"><![CDATA[Update via caps]]></SetVar>' +
                            '<SetVar Name="urn:schemas-microsoft-com:office:office#Roles"><![CDATA[1;#;#4;#;#6]]></SetVar>' +
                        '</Method>' +
                    '</ows:Batch>' +
                '</Batch>';


            beforeEach(function() {
                batchXML = resultXML = "";
                fixtures = loadJSONFixtures('singleItem.json');
            });

            it("single", function() {
                batchXML = EquivalentXml.xml(caps.createBatchMethod(fixtures['singleItem.json']));
                resultXML = EquivalentXml.xml(result);

                expect(batchXML).beEquivalentTo(resultXML);
            });

        });

    });

    describe("processBatchData", function() {
        it("should be a function", function() {
            expect(typeof caps.processBatchData).toBe('function');
        });
    });

});
/*

 describe("Sinon Fake Server With Jasmine", function () {
 var server, callbacks;

 beforeEach(function () {
 console.log('done');
 server = sinon.fakeServer.create();
 server.respondWith("GET", "/something",
 [200, { "Content-Type": "application/json" },
 '{ "stuff": "is", "awesome": "in here" }']);

 callbacks = [sinon.spy(), sinon.spy()];

 jQuery.ajax({
 url: "/something",
 success: callbacks[0]
 });

 jQuery.ajax({
 url: "/other",
 success: callbacks[1]
 });

 server.respond(); // Process all requests so far
 });

 afterEach(function () {
 server.restore();
 });

 it("should be true on first callback", function () {
 expect(callbacks[0].calledOnce).toBeTruthy();
 });

 it("should be object from data on first callback true", function () {
 expect(callbacks[0].calledWith({
 stuff: "is",
 awesome: "in here"
 })).toBeTruthy();
 });

 it("should call the callback to be false", function () {
 expect(callbacks[1].calledOnce).toBeFalsy(); // Unknown URL /other received 404
 });

 });
 */
