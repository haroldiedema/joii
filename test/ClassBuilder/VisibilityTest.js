/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * Tests visibility and accessibility of properties.
 */
test('ClassBuilder:VisibilityTest', function(assert) {

    // Base class definition.
    var VisibilityTestClass = JOII.ClassBuilder({}, {
        'protected number a' : 1,
        'protected function test' : function() {
            return this.a;
        },
        'public function runTest': function() {
            return this.test();
        }
    });

    var t = new VisibilityTestClass();

    assert.strictEqual(t.runTest(), 1, 'Public function returns protected function result.');
});
