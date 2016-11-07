/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * Tests instantiation of classes and the final result. Also tests integrity
 * of getter/setter method-generation for public properties.
 */
test('ClassBuilder:InstantiationTest', function(assert) {

    // Create a base class with 3 public properties. Note: If no visibility
    // is specified, JOII assumes the property is public. Scalar properties are
    // not referencable in JavaScript, therefore we're generating getters and
    // setters for them instead.
    var BaseClass = JOII.ClassBuilder({}, {
        a: 1,
        b: "Foobar",
        c: { 'hello' : 'world' }
    });

    var a = new BaseClass();

    // Verify that all getters and setters are created successfully.
    assert.equal(typeof(a.getA), 'function', 'Getter for property "a" exists.');
    assert.equal(typeof(a.getB), 'function', 'Getter for property "b" exists.');
    assert.equal(typeof(a.getC), 'function', 'Getter for property "c" exists.');
    assert.equal(typeof(a.setA), 'function', 'Setter for property "a" exists.');
    assert.equal(typeof(a.setB), 'function', 'Setter for property "b" exists.');
    assert.equal(typeof(a.setC), 'function', 'Setter for property "c" exists.');

    // The plain properties must not be defined in the instantiated class.
    assert.equal(typeof(a.a), 'undefined', 'Actualy property "a" is undefined.');
    assert.equal(typeof(a.b), 'undefined', 'Actualy property "b" is undefined.');
    assert.equal(typeof(a.c), 'undefined', 'Actualy property "c" is undefined.');

    // Test integrity of value retrieval using getters.
    assert.strictEqual(a.getA(), 1, 'Value of property "a" using getter is OK.');
    assert.strictEqual(a.getB(), "Foobar", 'Value of property "b" using getter is OK.');
    assert.deepEqual(a.getC(), { 'hello' : 'world' }, 'Value of property "c" using getter is OK.');

    // Test updating a property using the setter and retrieving it again using
    // the getter for the associated property.
    a.setA(2);
    a.setB('foo');
    a.setC({'foo' : 'bar'});

    // Verify that the updated values are set correctly.
    assert.strictEqual(a.getA(), 2, 'Value of property "a" is updated correctly.');
    assert.strictEqual(a.getB(), 'foo', 'Value of property "b" is updated correctly.');
    assert.deepEqual(a.getC(), {'foo':'bar'}, 'Value of property "c" is updated correctly.');

    var fluid = JOII.ClassBuilder({

        a: function() {
            return this.__api__;
        },

        b: function() {
            return this.__api__;
        }

    });

    var f = new fluid();

    assert.strictEqual(typeof(f.__api__), 'undefined', '__api__ is undefined in public scope');
    assert.strictEqual(typeof(f.a()), 'object', 'f.a returns an object.');
    assert.strictEqual(typeof(f.a().b), 'function', 'f.a.b is a function.');
    assert.strictEqual(typeof(f.a().b().a), 'function', 'f.a.b.a returns a function.');

    // 3.1.0: Custom constructors
    JOII.Config.addConstructor('main');
    var xx,xxx;

    xx = JOII.ClassBuilder({ a: 0, main: function () { this.a = 1; }}); xxx = new xx();
    assert.strictEqual(xxx.getA(), 1, 'Custom constructor "main" called.');
    xx = JOII.ClassBuilder({ a: 0, construct: function () { this.a = 1; }}); xxx = new xx();
    assert.strictEqual(xxx.getA(), 1, 'New default constructor "construct" called.');
    xx = JOII.ClassBuilder({ a: 0, '->': function () { this.a = 1; }}); xxx = new xx();
    assert.strictEqual(xxx.getA(), 1, 'New default constructor "->" called.');
    xx = JOII.ClassBuilder({ a: 0, '=>': function () { this.a = 1; }}); xxx = new xx();
    assert.strictEqual(xxx.getA(), 1, 'New default constructor "=>" called.');
    xx = JOII.ClassBuilder({ a: 0, __construct: function () { this.a = 1; }}); xxx = new xx();
    assert.strictEqual(xxx.getA(), 1, 'Original constructor "__construct" called.');
});
