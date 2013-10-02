describe('fn AMD', function() {
    var fn = require('fn');

    it('should have a format function', function() {
        expect(typeof fn.format).toBe('function');
    });

    it('should have a checkNested function', function() {
        expect(typeof fn.checkNested).toBe('function');
    });

});
