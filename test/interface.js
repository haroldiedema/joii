test('Interfaces', function(assert) {

    // _____________________________________________________________________ //

    var i1 = Interface({
        num: 'number',
        str: 'string',
        obj: 'object',
        fn: 'function'
    });

    var m = '';
    try { var b = Class({ 'implements': i1 }, { }); new b(); } catch (e) { m = e.message; }

    assert.equal(m, 'Class is missing number implementation of property "num".', 'Correct exception thrown for missing implementations.');

    m = '';
    try { var b = Class({ 'implements': i1 }, { num: 'test' }); new b(); } catch (e) { m = e.message; }
    assert.equal(m, 'Property "num" must be of type "number", string detected.', 'Correct exception thrown for type-mismatch in implementation.');

    var a = Class({ 'implements': i1 }, {
        num: 1,
        str: 'foo',
        obj: {},
        fn: function(){}
    });

    a1 = new a();
    assert.ok(a1.instanceOf(i1), 'Correctly implemented class is an instance of the corresponding interface.');

    var i2 = Interface({
        a: 'boolean',
        b: 'number'
    });

    var m = '';
    try {
        var b = Class({ 'implements': [i1, i2] }, {
            num: 1,
            str: 'foo',
            obj: {},
            fn: function(){}
        });
        new b();
    } catch (e) {
        m = e.message;
    }
    assert.equal(m, 'Class is missing boolean implementation of property "a".', 'Correct exception thrown for missing implementations when implementing multiple interfaces.');

    var b = Class({ 'implements': [i1, i2] }, {
        num: 1,
        str: 'foo',
        obj: {},
        fn: function(){},
        a: true,
        b: 123
    });
    b1 = new b();

    assert.ok(b1.instanceOf(i1), 'B is instance of Interface 1.');
    assert.ok(b1.instanceOf(i2), 'B is instance of Interface 2.');

    var c = Class({ 'extends': b }, {

    });

    var c1 = new c();
    assert.ok(c1.instanceOf(i1), 'Class extending on B is instance of Interface 1.');
    assert.ok(c1.instanceOf(i2), 'Class extending on B is instance of Interface 2.');

    var m = '';
    try {
        var b = Class({ 'extends': b }, {
            num: 'not a number'
        });
        new b();
    } catch (e) {
        m = e.message;
    }
    assert.equal(m, 'Property "num" must be of type "number", string detected.', 'Correct exception thrown when overriding a correctly implemented property but with wrong type.');


    var a = Class({'implements': i2}, { });
    var b = Class({'extends' : a}, {});
    var m = '';
    try {
        b1 = new b();
    } catch (e) {
        m = e.message;
    }
    assert.equal(m, 'Class is missing boolean implementation of property "a".', 'Correct exception thrown of missing implementation in child class with interface on parent.');
});
