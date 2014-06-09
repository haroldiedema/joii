test('Class - Dependency Injection', function(assert) {

    var DataContainer = Class({
        a: null,
        b: null,

        __construct: function(a, b) {
            this.a = a;
            this.b = b;
        }
    });

    Service('dc1', DataContainer, { a: 1, b: 2 });
    Service('dc2', DataContainer, { a: 3, b: 4 });

    var InjectClass = Class({

        __construct: function()
        {
            this.a = this.getService('dc1');
            this.b = this.getService('dc2');

            assert.equal(this.a.a, 1, 'DataContainer service "dc1" a = 1');
            assert.equal(this.a.b, 2, 'DataContainer service "dc1" b = 2');

            assert.equal(this.b.a, 3, 'DataContainer service "dc2" a = 3');
            assert.equal(this.b.b, 4, 'DataContainer service "dc2" b = 4');
        },

        getDataContainer1: function() {
            return this.a;
        }
    });

    var ic = new InjectClass();

    // _____________________________________________________________________ //

    var Logger = Class({

        __construct: function(a, b)
        {
            assert.equal(a.a, 1, 'Service dependency "dc1" correctly injected.');
            assert.equal(b.a, 3, 'Service dependency "dc2" correctly injected.');
            a.a = 6;
        }
    });

    Service('logger', Logger, { a: '@dc1', b: '@dc2' });

    var InjectClass = Class({
        __construct: function() {
            this.logger = this.getService('logger');
            this.dc1 = this.getService('dc1');
            assert.equal(this.dc1.a, 6, 'Service "dc1" property modified by logger.');
        }
    });

    new InjectClass();
    assert.equal(ic.getDataContainer1().a, 6, 'Previously instantiated class has updated dc1 value.');

    // _____________________________________________________________________ //

    var c1 = Class({

        __construct: function()
        {
            var dc1 = this.getService('dc1');
            assert.equal(dc1.a, 6, 'Retrieve "dc1" with updated property using this.getService()');
        }

    });

    new c1();
});