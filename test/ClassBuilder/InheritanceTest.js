/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * Tests getters, setters and inheritance of instantiated class defintions.
 */
test('ClassBuilder:InheritanceTest', function(assert) {

    // BaseClass declaration with 3 public properties. We'll be extending on
    // this class to see if the integrity of these values stay intact within
    // the correct context.
    var BaseClass = JOII.ClassBuilder({}, {a: 1, b: 'foo', c: {'foo':'bar'}});
    var Child1    = JOII.ClassBuilder({ 'extends' : BaseClass }, {});
    var Child2    = JOII.ClassBuilder({ 'extends' : BaseClass }, {});

    // Verify that getters and setters exist within the instantiated children.
    var c1 = new Child1();
    var c2 = new Child2();

    assert.equal(typeof(c1.getA), 'function', 'Getter "getA" in Child1 exists.');
    assert.equal(typeof(c1.getB), 'function', 'Getter "getB" in Child1 exists.');
    assert.equal(typeof(c1.getC), 'function', 'Getter "getC" in Child1 exists.');
    assert.equal(typeof(c1.setA), 'function', 'Setter "setA" in Child1 exists.');
    assert.equal(typeof(c1.setB), 'function', 'Setter "setB" in Child1 exists.');
    assert.equal(typeof(c1.setC), 'function', 'Setter "setC" in Child1 exists.');
    assert.equal(typeof(c2.getA), 'function', 'Getter "getA" in Child2 exists.');
    assert.equal(typeof(c2.getB), 'function', 'Getter "getB" in Child2 exists.');
    assert.equal(typeof(c2.getC), 'function', 'Getter "getC" in Child2 exists.');
    assert.equal(typeof(c2.setA), 'function', 'Setter "setA" in Child2 exists.');
    assert.equal(typeof(c2.setB), 'function', 'Setter "setB" in Child2 exists.');
    assert.equal(typeof(c2.setC), 'function', 'Setter "setC" in Child2 exists.');

    // Update the values in Child1. Check if Child2 is still intact with its
    // original values inherited from BaseClass.
    c1.setA(2);
    c1.setB('bar');
    c1.setC({'foo' : 123});

    assert.strictEqual(c1.getA(), 2, 'Updated value of "a" in Child1 OK.');
    assert.strictEqual(c2.getA(), 1, 'Original value of "a" in Child2 OK.');
    assert.strictEqual(c1.getB(), 'bar', 'Updated value of "b" in Child1 OK.');
    assert.strictEqual(c2.getB(), 'foo', 'Original value of "b" in Child2 OK.');
    assert.deepEqual(c1.getC(), {'foo' : 123}, 'Updated value of "c" in Child1 OK.');
    assert.deepEqual(c2.getC(), {'foo' : 'bar' }, 'Original value of "c" in Child2 OK.');

    // Instantiate the BaseClass and verify if the original values of BaseClass
    // are still intact.
    var b = new BaseClass();
    assert.strictEqual(b.getA(), 1, 'Original value of "a" in BaseClass OK.');
    assert.strictEqual(b.getB(), 'foo', 'Original value of "b" in BaseClass OK.');
    assert.deepEqual(b.getC(), {'foo' : 'bar' }, 'Original value of "c" in BaseClass OK.');

    // Create a child class with a custom setter which calles the parent setter after
    // adjusting the value a little.
    var SuperClass = JOII.ClassBuilder({'extends': BaseClass}, {
        setA: function(value) {
            this['super']('setA', value + 1);
        },
        setB: function(value) {
            this.b = value;
        },
        getC: function() {
            return this.c;
        }
    });

    var s = new SuperClass();

    s.setA(2);
    s.setB('hello');
    assert.strictEqual(s.getA(), 3, 'Value of property "a" set correctly using custom setter.');
    assert.strictEqual(s.getB(), 'hello', 'Value of property "b" set correctly using custom setter.');
    assert.deepEqual(s.getC(), {'foo': 'bar'}, 'Value of property "c" get correctly using custom getter.');

    s.setC({'foo':'rawr'});
    assert.deepEqual(s.getC(), {'foo':'rawr'}, 'Value of property "c" get correctly using custom getter after update.');

    // Since we've been modifying some things now, check the integrity of the
    // previously created instances again. No properties must be referenced
    // back to eachother!
    assert.strictEqual(c1.getA(), 2, 'Updated value of "a" in Child1 is still OK.');
    assert.strictEqual(c2.getA(), 1, 'Original value of "a" in Child2 is still OK.');
    assert.strictEqual(c1.getB(), 'bar', 'Updated value of "b" in Child1 is still OK.');
    assert.strictEqual(c2.getB(), 'foo', 'Original value of "b" in Child2 is still OK.');
    assert.deepEqual(c1.getC(), {'foo' : 123}, 'Updated value of "c" in Child1 is still OK.');
    assert.deepEqual(c2.getC(), {'foo' : 'bar' }, 'Original value of "c" in Child2 is still OK.');
    assert.strictEqual(b.getA(), 1, 'Original value of "a" in BaseClass is still OK.');
    assert.strictEqual(b.getB(), 'foo', 'Original value of "b" in BaseClass is still OK.');
    assert.deepEqual(b.getC(), {'foo' : 'bar' }, 'Original value of "c" in BaseClass is still OK.');

    // Extend on SuperClass to see if the 'super'-method still functions
    // correctly midway the chain.
    var ChildOfSuper = JOII.ClassBuilder({'extends': SuperClass}, {});

    var cos = new ChildOfSuper();
    cos.setA(10);
    assert.strictEqual(cos.getA(), 11, 'Value of property "a" set correctly using custom setter in ChildOfSuper.');
});
