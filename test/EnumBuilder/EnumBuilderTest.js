/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
* Tests instanceOf functionality.
*/
test('EnumBulder:EnumBuilderTest', function(assert) {

    /**
     * Tests if the given Class (c) throws an exception due to
     * interface validation with the given expected exception string.
     *
     * @param {Function} fn
     * @param {String}   expected_exception_string
     */
    var testException = function(fn, expected_exception_string) {
        assert.throws(fn, function(err) {
            return err === expected_exception_string ? true : err;
        }, 'Error thrown: ' + expected_exception_string);
    };

    // Plain object enum.
    var plain = JOII.EnumBuilder('test1', { ONE: 1, TWO: 2});

    assert.strictEqual(plain.ONE, 1, 'plainObj: plain.ONE exists');
    assert.strictEqual(plain.TWO, 2, 'plainObj: plain.TWO exists');

    // Class enum
    var cls = JOII.ClassBuilder({ 'enum': 'EnumTest2', expose_enum: true }, { 'const ONE' : 1, 'const TWO' : 2 });

    assert.strictEqual(cls.ONE, 1, 'classObj: cls.ONE exists');
    assert.strictEqual(cls.TWO, 2, 'classObj: cls.TWO exists');

    // Test exposure of test2.
    assert.strictEqual(typeof(EnumTest2), 'object', 'EnumTest2 exists in the global namespace');
    assert.strictEqual(EnumTest2.contains(cls.ONE), true, 'cls.ONE exists within EnumTest2');

    // Test validation
    assert.strictEqual(typeof(JOII.EnumRegistry.test1), 'object', 'Test1 correctly registered');
    assert.strictEqual(JOII.EnumRegistry.test1.contains(1), true, 'Test1 contains 1');
    assert.strictEqual(JOII.EnumRegistry.test1.contains(2), true, 'Test1 contains 2');
    assert.strictEqual(JOII.EnumRegistry.test1.contains(3), false, 'Test1 does not contain 3');

    // Test duplicate enum name
    testException(function() {
        JOII.EnumBuilder('test1', { ONE: 1, TWO: 2});
    }, 'Enumerator "test1" already exists.');

    // Test invalid content: function
    testException(function() {
        JOII.EnumBuilder('test3', { ONE: function() {}, TWO: 2});
    }, 'An enumerator cannot contain functions. "ONE" is a function.');

    // Test invalid content: object
    testException(function() {
        JOII.EnumBuilder('test4', { ONE: {}, TWO: 2});
    }, 'An enumerator cannot contain objects. "ONE" is an object.');

    // Test interface
    var I1 = JOII.InterfaceBuilder({ 'enum': 'InterfaceEnum', expose_enum: true }, {
        'const ONE' : 1,
        'const TWO' : 2
    });

    assert.strictEqual(I1.ONE, 1, 'interfaceObj: I1.ONE exists');
    assert.strictEqual(I1.TWO, 2, 'interfaceObj: I1.TWO exists');

    assert.strictEqual(InterfaceEnum.ONE, 1, 'interfaceObj: InterfaceEnum.ONE exists');
    assert.strictEqual(InterfaceEnum.TWO, 2, 'interfaceObj: InterfaceEnum.TWO exists');

    var I2 = JOII.InterfaceBuilder({ 'enum': 'InterfaceEnum2', expose_enum: true, 'extends' : I1 }, {
        'const THREE' : 3,
        'const FOUR'  : 4
    });

    assert.strictEqual(I2.ONE, 1, 'interfaceObj: I1.ONE exists');
    assert.strictEqual(I2.TWO, 2, 'interfaceObj: I1.TWO exists');
    assert.strictEqual(I2.THREE, 3, 'interfaceObj: I1.THREE exists');
    assert.strictEqual(I2.FOUR, 4, 'interfaceObj: I1.FOUR exists');

    assert.strictEqual(InterfaceEnum2.ONE, 1, 'interfaceObj: InterfaceEnum.ONE exists');
    assert.strictEqual(InterfaceEnum2.TWO, 2, 'interfaceObj: InterfaceEnum.TWO exists');
    assert.strictEqual(InterfaceEnum2.THREE, 3, 'interfaceObj: InterfaceEnum.THREE exists');
    assert.strictEqual(InterfaceEnum2.FOUR, 4, 'interfaceObj: InterfaceEnum.FOUR exists');
});
