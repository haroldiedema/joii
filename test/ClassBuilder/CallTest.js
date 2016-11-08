/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
* Tests the functionality of __call.
*/
test('ClassBuilder:CallTest', function(assert) {

    var C1 = JOII.ClassBuilder({
        __call: function() { return true; }
    });
    assert.strictEqual(C1(), true, '__call function OK.');

    // __call may not return "this", because it references to the static
    // definition of the class body.
    assert.throws(function() {
        var a = JOII.ClassBuilder({ 'public function foo' : function() {}, __call: function() { return this; }}); a();
    }, function(err) { return err === '__call cannot return itself.'; }, '__call cannot return itself.');

    // Test the context of a static call.
    var C2 = JOII.ClassBuilder({
        a: 1,

        __call: function(val) {
            if (!val) {
                return this.a;
            }
            this.a = val;
        }
    });

    var c2 = new C2();
    assert.strictEqual(c2.getA(), 1, 'c2.getA() returns this.a (1)');
    assert.strictEqual(C2(), 1, '__call returns this.a (1)');

    // Update the value, THEN create another instance and check again...
    C2(2);
    var c2a = new C2();
    assert.strictEqual(C2(), 2, '__call returns this.a (2)');
    assert.strictEqual(c2.getA(), 1, 'c2.getA() returns this.a (1)');
    assert.strictEqual(c2a.getA(), 1, 'c2a.getA() returns this.a (1)');


    // 3.1.0: Custom callable method names.

    var C3 = JOII.ClassBuilder({'<>': function() { return 1; } });
    assert.strictEqual(C3(), 1, 'New default call method "<>" used.');

    JOII.Config.addCallable('execute');
    var C4 = JOII.ClassBuilder({'execute': function() { return 2; } });
    assert.strictEqual(C4(), 2, 'Custom call method "execute" used.');

});
