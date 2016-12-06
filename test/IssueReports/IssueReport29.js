/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/

var requirejsLocal = require('requirejs');

// workaround for browser
if (typeof(requirejsLocal.requirejs) !== 'undefined') {
    requirejsLocal = requirejsLocal.requirejs;
}

requirejsLocal.config({
    baseUrl: 'dist'
});


requirejsLocal(['joii'], function(anonJOII) {
    /**
     * Setters shouldn't throw errors when JOII is loaded anonymously
     */
    test('IssueReports:IssueReport29', function(assert) {
        
        // temporarily remove JOII from global scope
        var oldJOII = null;
        if (typeof(window) !== 'undefined') {
            oldJOII = window.JOII;
            delete window.JOII;
        } else {
            oldJOII = global.JOII;
            delete global.JOII;
        }

        try {
            var TestClass = anonJOII.Class({
                'public number value': 1
            });

            var tc = new TestClass();

        
            assert.strictEqual(tc.getValue(), 1, 'tc.getValue() returns this.value (1)');

            tc.setValue(2);
        
            assert.strictEqual(tc.getValue(), 2, 'tc.getValue() returns this.value (2)');

        } finally {
            // restore JOII to global scope
            if (oldJOII !== null) {
                if (typeof(window) !== 'undefined') {
                    window.JOII = oldJOII;
                } else {
                    global.JOII = oldJOII;
                }
            }
        }
        
    });
});