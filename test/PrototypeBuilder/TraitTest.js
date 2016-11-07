/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * Tests class property meta data and validation.
 */
test('PrototypeBuilder:TraitTest', function(assert) {

    var t1 = {
        add: function(a, b) {
            return a + b;
        }
    };

    var c = JOII.ClassBuilder({ 'uses': t1 }, {
        a: 0,
        __construct: function() {
            this.a = this.add(1,2);
        }
    });

    var c1 = new c();
    assert.equal(3, c1.getA(), 'Trait applied correctly.');

    // _____________________________________________________________________ //

    var d = JOII.ClassBuilder({'extends': c}, {
        __construct: function() {
            this.a = this.add(38, 4);
        }
    });
    var d1 = new d();
    assert.equal(42, d1.getA(), 'Trait declared in parent class is usable from child class.');

    // _____________________________________________________________________ //

    var e = JOII.ClassBuilder({
        a: 0,
        __construct: function() {
            this.a = this.add(38, 4);
        }
    });
    var f = JOII.ClassBuilder({'extends': e, 'uses': t1}, {});

    var f1 = new f();
    assert.equal(42, f1.getA(), 'Trait declared in child class is usable from parent class.');

    var g = JOII.ClassBuilder({'extends': e, 'uses': t1}, {
        __construct: function() {
            this['super']('__construct');
        }
    });
    var g1 = new g();
    assert.equal(42, g1.getA(), 'Trait called correctly from child constructer which called parent contructor.');

});
