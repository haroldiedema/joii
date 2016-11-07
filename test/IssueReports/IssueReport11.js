/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * Tests getters, setters and inheritance of instantiated class defintions.
 */
test('IssueReports:IssueReport11', function(assert) {
    var A = JOII.ClassBuilder({
        'public A': null,
        'public B': null,

        'public function f1': function() {
            this.setA('A');
        },
        'public function f2': function() {
            this.setB('B');
            this.f1();
        }
    });
    var B = JOII.ClassBuilder({'extends': A}, {
        'public function f3': function() {
            this.f2();
        },
        'public function f4': function() {
            this.super('f2');
        }
    });
    var b = new B();
    assert.equal(typeof(b.f3), 'function', 'f3 exists on the child');
    assert.equal(typeof(b.f2), 'function', 'f2 exists on the child');
    assert.equal(typeof(b.f1), 'function', 'f1 exists on the child');
    b.f3();
    b.super('f2');
    b.super('f1');
    assert.equal(b.getA(), 'A', 'Parent method f1 called from parent within scope of child');
    assert.equal(b.getB(), 'B', 'Parent method f2 called within scope of child');
    var b2 = new B();
    assert.equal(b2.getA(), null, 'New instance of model property A set correctly');
    assert.equal(b2.getB(), null, 'New instance of model property B set correctly');
    b2.f4();
    assert.equal(b2.getA(), 'A', 'Parent method f1 called from parent within scope of child with use of "super"');
    assert.equal(b2.getB(), 'B', 'Parent method f2 called within scope of child with use of "super"');
});
