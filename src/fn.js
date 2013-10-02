define(function() {

    function checkNested( obj ) {
        var args = Array.prototype.slice.call(arguments);
        var obj = args.shift();

        for ( var i = 0; i < args.length; i++ ) {
            if ( !obj.hasOwnProperty(args[i]) ) {
                return false;
            }
            obj = obj[args[i]];
        }
        return true;
    }

    function format ( str, col ) {
        col = typeof col === 'object' ? col : Array.prototype.slice.call(arguments, 1);

        return str.replace(/\{\{|\}\}|\{(\w+)\}/g, function( m, n ) {
            if ( m == "{{" ) {
                return "{";
            }
            if ( m == "}}" ) {
                return "}";
            }
            return col[n];
        });
    }

    return {
        checkNested: checkNested,
        format: format
    }
});