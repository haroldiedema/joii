test('JOII Plugin - Mixin', function(assert) {

    var m1 = {
        m1: function() {
            return 1;
        }
    };

    var m2 = {
        m2: function() {
            return 2;
        }
    };

    var MyClass = $.Class({
        foo: 0,

        __construct: function() {
            this.mixin(m1);
        },

        test: function() {
            this.foo = this.m1() + this.m2();
        }
    });

    var m = new MyClass();
    m.mixin(m2);

    assert.equal(typeof(m.m1), 'function', 'Mixin via constructor registered OK.');
    assert.equal(typeof(m.m2), 'function', 'Mixin outside scope registered OK.');

    m.test();
    assert.equal(m.foo, 3, 'Both mixins registered successfully and function OK.');
});
