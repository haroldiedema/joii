/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
* Tests instanceOf functionality.
*/
test('InterfaceBuilder:InstanceOfTest', function(assert) {

    var I1 = JOII.InterfaceBuilder({});
    var I2 = JOII.InterfaceBuilder({});
    var I3 = JOII.InterfaceBuilder({});
    var I4 = JOII.InterfaceBuilder({});

    var c1Base = JOII.ClassBuilder({'implements': I1}, {});
    var c1 = new c1Base();
    assert.strictEqual(c1.instanceOf(c1Base), true, 'c1 is an instance of c1Base');
    assert.strictEqual(c1.instanceOf(I1), true, 'c1 is an instance of I1');
    assert.strictEqual(c1.instanceOf(I2), false, 'c1 is NOT an instance of I2');

    var c1Child = JOII.ClassBuilder({'extends': c1Base}, {});
    var c1a = new c1Child();
    assert.strictEqual(c1a.instanceOf(c1Base), true, 'c1a is an instance of c1Base');
    assert.strictEqual(c1a.instanceOf(c1Child), true, 'c1a is an instance of c1Child');
    assert.strictEqual(c1a.instanceOf(I1), true, 'c1a is an instance of I1');
    assert.strictEqual(c1a.instanceOf(I2), false, 'c1a is NOT an instance of I2');

    var c2Child = JOII.ClassBuilder({'extends': c1Child, 'implements' : [I2, I3]}, {});
    var c1b = new c2Child();
    assert.strictEqual(c1b.instanceOf(c1Base), true, 'c1b is an instance of c1Base');
    assert.strictEqual(c1b.instanceOf(c1Child), true, 'c1b is an instance of c1Child');
    assert.strictEqual(c1b.instanceOf(I1), true, 'c1b is an instance of I1');
    assert.strictEqual(c1b.instanceOf(I2), true, 'c1b is an instance of I2');

    var c3Child = JOII.ClassBuilder({'extends': c1Base, 'implements' : [I2, I4]}, {});
    var c1c = new c3Child();
    assert.strictEqual(c1c.instanceOf(c1Base), true, 'c1b is an instance of c1Base');
    assert.strictEqual(c1c.instanceOf(c1Child), false, 'c1b is NOT an instance of c1Child');
    assert.strictEqual(c1c.instanceOf(c2Child), false, 'c1b is NOT an instance of c2Child');
    assert.strictEqual(c1c.instanceOf(I1), true, 'c1b is an instance of I1');
    assert.strictEqual(c1c.instanceOf(I2), true, 'c1b is an instance of I2');

    assert.strictEqual(c1.instanceOf(I2), false, 'c1 is still NOT an instance of I2');
});
