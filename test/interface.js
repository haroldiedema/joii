test('Interfaces', function(assert) {

    var b, m, a;

    // _____________________________________________________________________ //

    var i1 = Interface({
        num: 'number',
        str: 'string',
        obj: 'object',
        fn: 'function'
    });

    m = '';
    try { b = Class({ 'implements': i1 }, { }); new b(); } catch (e) { m = e.message; }

    assert.equal(m, 'Class is missing number implementation of property "num".', 'Correct exception thrown for missing implementations.');

    m = '';
    try { b = Class({ 'implements': i1 }, { num: 'test' }); new b(); } catch (e) { m = e.message; }
    assert.equal(m, 'Property "num" must be of type "number", string detected.', 'Correct exception thrown for type-mismatch in implementation.');

    a = Class({ 'implements': i1 }, {
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

    m = '';
    try {
        b = Class({ 'implements': [i1, i2] }, {
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

    b = Class({ 'implements': [i1, i2] }, {
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

    m = '';
    try {
        b = Class({ 'extends': b }, {
            num: 'not a number'
        });
        new b();
    } catch (e) {
        m = e.message;
    }
    assert.equal(m, 'Property "num" must be of type "number", string detected.', 'Correct exception thrown when overriding a correctly implemented property but with wrong type.');


    a = Class({'implements': i2}, { });
    b = Class({'extends' : a}, {});
    m = '';
    try {
        b1 = new b();
    } catch (e) {
        m = e.message;
    }
    assert.equal(m, 'Class is missing boolean implementation of property "a".', 'Correct exception thrown of missing implementation in child class with interface on parent.');


    var t;

    m = '';
    try {
        t = Interface({}, {
            m2: {}
        });
    } catch(e) {
        m = e.message;
    }

    assert.equal(m, 'An interface definition must be a string, defining the property type.', 'Exception on definition must be string');


});
