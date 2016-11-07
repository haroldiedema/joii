/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * This test does NOT test validation of interfaces on classes, but instead
 * tests the final result of the interface function based on the parameters
 * given to the InterfaceBuilder.
 */
test('InterfaceBuilder:InterfaceBuilderTest', function(assert) {

    var testDefinition = function(i, name) {
        assert.equal(typeof(i), 'function', 'Interface is available as a function.');
        assert.equal(typeof(i.definition), 'function', 'Interface definition is available as a function.');
        assert.equal(typeof(i.definition.__interface__), 'object', 'Interface metadata is available as an object.');
        assert.equal(typeof(i.definition.__interface__.name), 'string', 'Interface name is available as a string.');
        assert.equal(typeof(i.definition.__interface__.reflector), 'object', 'Interface definition reflector is available as an object.');
        assert.equal(typeof(i.definition.__interface__.prototype), 'object', 'Interface definition prototype is available as an object.');
        if (typeof(name) !== 'undefined') {
            assert.equal(i.definition.__interface__.name, name, 'Interface name is OK.');
        }
    };

    // Test empty interfaces
    testDefinition(JOII.InterfaceBuilder({}));
    testDefinition(JOII.InterfaceBuilder({}, {}));
    testDefinition(JOII.InterfaceBuilder('empty', {}, {}), 'empty');
    testDefinition(JOII.InterfaceBuilder('SomeInterfaceName'), 'SomeInterfaceName');
    testDefinition(JOII.InterfaceBuilder('AnotherInterfaceName', {}), 'AnotherInterfaceName');
});
