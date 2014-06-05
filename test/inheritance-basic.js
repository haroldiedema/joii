test('Class - Inheriting (basic)', function(assert) {

    // _____________________________________________________________________ //

    var first = Class({ a: 0, __construct: function() { this.a = 1; } });
    var second = Class({'extends' : first }, { b: 1, __construct: function() { this.b = this.a + 1; this.a = 10; } });
    var third = Class({'extends' : second }, { c: 1, __construct: function() { this.c = this.b + 1; } });

    var f = new first();
    assert.equal(f.a, 1, 'Base class instance correctly instantiated');

    var s = new second();
    assert.equal(f.a, 1, 'Base (first) class property is unmodified.');
    assert.equal(s.a, 10, 'Child (second) class property is modified.');
    assert.equal(s.b, 1, 'Child (second) class property is modified by inherited value of (first).');

    var t = new third();
    assert.equal(t.c, 2, 'Child (third) class property is modified by inherited value of (first) and (second).');

    // _____________________________________________________________________ //

    var first = Class({
        a: 0,
        __construct: function() {
            this.a = 1;
        }
    });
    var second = Class({ 'extends' : first }, {
        b: 0,
        __construct: function() {
            this['super']('__construct');
            this.b = this.a + 1;
        }
    });
    var s = new second();
    assert.equal(s.a, 1, 'Parent constructor called using super(), modified property correctly');
    assert.equal(s.b, 2, 'Property correctly modified after calling parent constructor');


});
