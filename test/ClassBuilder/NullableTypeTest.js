/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * Tests the metadata validation of a nullable type.
 */
test('ClassBuilder:NullableTypeTest', function(assert) {

    // Delcaration of a class with nullable types.
    var MyClass = JOII.ClassBuilder({}, {
        'public nullable number a': 1,
        'public nullable object b': null
    });

    var a = new MyClass();

    assert.strictEqual(a.getA(), 1, 'Initial value of nullable type "a" is OK.');
    assert.strictEqual(a.getB(), null, 'Initial value of nullable type "b" is OK.');

    // If the nullable type works correctly, this should not throw an invalid
    // type exception:
    a.setA(null);
    assert.strictEqual(a.getA(), null, 'Updated value of nullable type "a" is OK.');

    // .. But this would:
    assert.throws(function() {
        a.setA("rawr");
    }, function(err) { return err === 'setA expects number, string given.'; }, 'Nullable mismatch exception thrown OK.');
});
