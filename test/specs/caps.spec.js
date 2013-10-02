describe('caps AMD', function() {
    var caps = require('caps');

    it('should have a version number', function() {
        expect(caps.VERSION).toBeDefined();
    });

    it('should have settings object', function() {
        expect(typeof caps.settings).toBe('object');
    });

    it('should have a fn object', function() {
        expect(typeof caps.fn).toBe('object');
    });

    it('should have a processBatchData object', function() {
        expect(typeof caps.processBatchData).toBe('object');
    });

});
