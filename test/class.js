test('Class - No Inheritance', function(assert) {

    // _____________________________________________________________________ //

    var first = Class({
        a: 0,
        __construct: function()
        {
            this.a = 1;
        }
    });
    var f = new first();
    assert.equal(f.a, 1, 'Instance with constructor that modified a property.');

    // _____________________________________________________________________ //

    var second = Class({
        a: 0,
        __construct: function(a)
        {
            this.a = a;
        }
    });

    var s = new second();
    assert.equal(s.a, undefined, 'Instance with no constructor arguments, modifying property.');

    var s = new second('foobar');
    assert.equal(s.a, 'foobar', 'Instance with constructor arguments, modifying property.');

    // _____________________________________________________________________ //

    var third = Class({
        a: 0,
        __construct: function(a, b) {
            this.a = this.add(a, b);
        },
        add: function(a, b) {
            return a + b;
        }
    });

    var t1 = new third(1, 2);
    assert.equal(t1.a, 3, 'Instance of third (t1): Constructor calls a member method, modifying a property');
    var t2 = new third(3, 3);
    assert.equal(t2.a, 6, 'Instance of third (t2): Constructor calls a member method, modifying a property');
    assert.equal(t1.a, 3, 'Instance of third (t1) is not modified by t2.');

    // _____________________________________________________________________ //

    var i1 = new first();
    var i2 = new second();
    var i3 = new third();

    assert.equal(true, i1.instanceOf(first), '(instanceOf) Asserting that i1 is an instance of first');
    assert.equal(true, i2.instanceOf(second), '(instanceOf) Asserting that i2 is an instance of second');
    assert.equal(true, i3.instanceOf(third), '(instanceOf) Asserting that i3 is an instance of third');
    assert.equal(false, i1.instanceOf(second), '(instanceOf) Asserting that i1 is not an instance of second');
    assert.equal(false, i3.instanceOf(first), '(instanceOf) Asserting that i3 is not an instance of first');

    // _____________________________________________________________________ //

    var c1 = Class({
        obj: {},

        __construct: function() {
            return {
                set: this.set
            };
        },

        set: function(a) {
            this.foo();
            this.obj[a] = a;
        },

        foo: function() {
            assert.equal(typeof(this.obj), 'object', 'Private method called successfully.');
            this.obj['private'] = true;
        }
    });

    var c2 = Class({ 'extends': c1 }, {
        __construct: function() {
            return {
                set: this.set,
                get: this.get
            };
        },
        get: function(a) {
            return this.obj[a];
        }
    });

    cc1 = new c1();
    cc2 = new c2();

    cc1.set('a');
    cc2.set('c');
    assert.equal(typeof(cc2.get('a')), 'undefined');
    assert.equal(typeof(cc2.get('c')), 'string');
    assert.equal(cc2.get('c'), 'c');
    assert.equal(typeof(cc2.get('private')), 'boolean', 'Confirmed private method has been called successfully.');
});
