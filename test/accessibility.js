test('Class - Accessibility', function(assert) {

    // _____________________________________________________________________ //

    var c1 = Class({

        a: 1,
        b: 2,
        c: 3,

        __construct: function() {
            return {
                a: this.a
            };
        }

    });

    var a = new c1();

    assert.equal(typeof(a.a), 'number', 'c1.a is a number');
    assert.equal(typeof(a.b), 'undefined', 'c1.b is undefined');
    assert.equal(typeof(a.c), 'undefined', 'c1.c is undefined');

    // _____________________________________________________________________ //

    var c2 = Class({'extends': c1}, {
        __construct: function() {
            return {
                a: this.a,
                b: this.b
            };
        }
    });

    var b = new c2();

    assert.equal(typeof(b.a), 'number', 'c2.a is a number');
    assert.equal(typeof(b.b), 'number', 'c2.b is a number');
    assert.equal(typeof(b.c), 'undefined', 'c2.c is undefined');

    // _____________________________________________________________________ //

    var i = Interface({
        foo: 'function'
    });

    var c3 = Class({'implements': i}, {

        p: 'private',

        __construct: function() {
            return {
                'foo': this.bar
            };
        },

        bar: function() {
            var x = this.p;
            this.p = 'I am private!';
            return x;
        }
    });

    var c = new c3();

    assert.equal(typeof(c.foo), 'function', 'c3.foo is a function');
    assert.equal(typeof(c.p), 'undefined', 'c3.p is private, thus undefined in from public.');
    assert.equal(c.foo(), 'private', 'c3.foo returns correct value');
    assert.equal(typeof(c.p), 'undefined', 'c3.p is still private.');
    assert.equal(c.foo(), 'I am private!', 'c3.foo still returns correct value after modification.');

});