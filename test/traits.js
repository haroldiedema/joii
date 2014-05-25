test('Traits', function(assert) {

    var t1 = {
        add: function(a, b) {
            return a + b;
        }
    };

    var c = $.Class({ 'uses': t1 }, {
        a: 0,
        __construct: function() {
            this.a = this.add(1,2);
        }
    });

    var c1 = new c();
    assert.equal(3, c1.a, 'Trait applied correctly.');

    // _____________________________________________________________________ //

    var d = $.Class({'extends': c}, {
        __construct: function() {
            this.a = this.add(38, 4);
        }
    });
    var d1 = new d();
    assert.equal(42, d1.a, 'Trait declared in parent class is usable from child class.');

    // _____________________________________________________________________ //

    var e = $.Class({
        a: 0,
        __construct: function() {
            this.a = this.add(38, 4);
        }
    });
    var f = $.Class({'extends': e, 'uses': t1}, {});

    var f1 = new f();
    assert.equal(42, f1.a, 'Trait declared in child class is usable from parent class.');

    var g = $.Class({'extends': e, 'uses': t1}, {
        __construct: function() {
            this['super']('__construct');
        }
    });
    var g1 = new g();
    assert.equal(42, g1.a, 'Trait called correctly from child constructer which called parent contructor.');
});
