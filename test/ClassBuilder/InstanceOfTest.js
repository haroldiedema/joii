/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
* Tests instanceOf functionality.
*/
test('ClassBuilder:InstanceOfTest', function(assert) {

    var cEmpty = JOII.ClassBuilder({});
    var c1 = new cEmpty();
    assert.strictEqual(c1.instanceOf(cEmpty), true, 'c1 is an instance of cEmpty');

    var cChild = JOII.ClassBuilder({'extends': cEmpty}, {});
    var c2 = new cChild();
    assert.strictEqual(c2.instanceOf(cEmpty), true, 'c2 is an instance of cEmpty');
    assert.strictEqual(c2.instanceOf(cChild), true, 'c2 is an instance of cChild');

    var cChild2 = JOII.ClassBuilder({'extends': cEmpty}, {});
    var c3 = new cChild2();
    assert.strictEqual(c3.instanceOf(cEmpty), true, 'c3 is an instance of cEmpty');
    assert.strictEqual(c3.instanceOf(cChild), false, 'c3 is NOT an instance of cChild');
    assert.strictEqual(c3.instanceOf(cChild2), true, 'c3 is an instance of cChild2');
});
