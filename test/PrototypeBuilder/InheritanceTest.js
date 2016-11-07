/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * Test the functionality of the 'extends' mechanism. Properties not defined in
 * the current prototype are inherited from the parent prototype. However,
 * modifying one property of a prototype should _not_ under any circumstance
 * modify the original value from its parent.
 *
 * Psuedo example of what could go wrong:
 *
 *  class base { a: 1, b: 2 }
 *  class child1 extends base { a: 10 }
 *  class child2 extends base { b: 20 }
 *
 * Expected values:
 *
 *  child1.a = 10, child1.b = 2
 *  child2.a = 1, child1.b = 20
 *
 *  base.a = 1
 *  base.b = 2
 *
 * If the inheritance chain gets messed up somehow, both properties from the
 * base class will get the values 10 and 20, no matter which child inherits
 * them.
 */
test('PrototypeBuilder:InheritanceTest', function(assert) {
    var obj_a = {a: 1, b: 2, c: 3, obj: {foo: 'bar'}};
    var obj_b = {a: 10, d: 4};
    var obj_c = {c: 4};

    var proto_a = JOII.PrototypeBuilder('Test', {}, obj_a);
    var proto_b_a = JOII.PrototypeBuilder('Test', { 'extends' : proto_a }, obj_b);
    var proto_c_a = JOII.PrototypeBuilder('Test', { 'extends' : proto_a }, obj_c);
    var proto_c_b = JOII.PrototypeBuilder('Test', { 'extends' : proto_b_a }, obj_c);

    // Test the resulting prototypes based on the defined parent objects.
    assert.strictEqual(proto_a.a, 1, 'Prototype a.a is OK.');
    assert.strictEqual(proto_a.b, 2, 'Prototype a.b is OK.');
    assert.strictEqual(proto_a.c, 3, 'Prototype a.c is OK.');
    assert.strictEqual(proto_a.obj.foo, 'bar', 'Prototype a.obj.foo is OK.');

    assert.strictEqual(proto_b_a.a, 10, 'Prototype b.a is OK.');
    assert.strictEqual(proto_b_a.b, 2, 'Prototype b.b is OK.');
    assert.strictEqual(proto_b_a.c, 3, 'Prototype b.c is OK.');
    assert.strictEqual(proto_b_a.d, 4, 'Prototype b.c is OK.');
    assert.strictEqual(proto_b_a.obj.foo, 'bar', 'Prototype a.obj.foo is OK.');

    assert.strictEqual(proto_c_a.a, 1, 'Prototype c_a.a is OK.');
    assert.strictEqual(proto_c_a.b, 2, 'Prototype c_a.b is OK.');
    assert.strictEqual(proto_c_a.c, 4, 'Prototype c_a.c is OK.');
    assert.strictEqual(proto_c_a.obj.foo, 'bar', 'Prototype c_a.obj.foo is OK.');

    assert.strictEqual(proto_c_b.a, 10, 'Prototype c_a.a is OK.');
    assert.strictEqual(proto_c_b.b, 2, 'Prototype c_a.b is OK.');
    assert.strictEqual(proto_c_b.c, 4, 'Prototype c_a.c is OK.');
    assert.strictEqual(proto_c_b.d, 4, 'Prototype c_a.c is OK.');
    assert.strictEqual(proto_c_b.obj.foo, 'bar', 'Prototype c_a.obj.foo is OK.');

    // Update the values of proto_b_a and verify if the values of proto_a are
    // still intact. Also check the other children that extend on proto_a.
    proto_b_a.a = 100;
    assert.strictEqual(proto_a.a, 1, 'proto_a.a is still OK after modifying child b_a.');
    assert.strictEqual(proto_c_a.a, 1, 'proto_a.a is still OK after modifying child c_a.');
    assert.strictEqual(proto_c_b.a, 10, 'proto_c_b.a is still OK after modifying child c_a.');

    // Modify c_a and verify the integrity of a, b_a and c_b.
    proto_c_a.b = 250;
    assert.strictEqual(proto_a.b, 2, 'proto_a.b is still OK after modifying child c_a.');
    assert.strictEqual(proto_b_a.b, 2, 'proto_b_a.b is still OK after modifying child c_a.');
    assert.strictEqual(proto_c_b.b, 2, 'proto_c_b.b is still OK after modifying child c_a.');

    // Fun stuff! Verify integrity of the object "obj" in the prototypes.
    proto_b_a.obj.foo = 'hello';
    assert.equal(proto_a.obj.foo, "bar", 'Integrity of obj in proto_a is OK.');
    assert.equal(proto_c_a.obj.foo, "bar", 'Integrity of obj in proto_c_a is OK.');
    assert.equal(proto_c_b.obj.foo, "bar", 'Integrity of obj in proto_c_b is OK.');
});
