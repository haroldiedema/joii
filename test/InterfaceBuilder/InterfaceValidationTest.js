/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * Tests the validation functionality of interfaces.
 */
test('InterfaceBuilder:InterfaceValidationTest', function(assert) {

    // An interface must never declare abstract types.
    assert.throws(function() {
        JOII.InterfaceBuilder('Test', {'abstract public string foobar': 'foobar'});
    }, function(err) { return err === 'An interface may not contain abstract definitions. Property foobar is abstract in interface Test.'; }, 'Exception is thrown when an interface declares abstract properties.');

    // An interface must never declare final types.
    assert.throws(function() {
        JOII.InterfaceBuilder('Test', {'final public string foobar': 'foobar'});
    }, function(err) { return err === 'An interface may not contain final definitions. Property foobar is final in interface Test.'; }, 'Exception is thrown when an interface declares final properties.');

    /**
     * Tests if the given Class (c) throws an exception due to
     * interface validation with the given expected exception string.
     *
     * @param {Interface} i
     * @param {Class}     body
     * @param {String}    expected_exception_string
     */
    var testException = function(i, body, expected_exception_string) {
        assert.throws(function() {
            JOII.ClassBuilder({ 'implements' : i }, body);
        }, function(err) { return err === expected_exception_string; }, 'Validator throws: ' + expected_exception_string);
    };

    var TestInterface = JOII.InterfaceBuilder('TestInterface', {
        'public nullable string name' : null,
        'protected number age' : null,
        'public function myTest' : function(a) {}
    });

    var ChildTestInterface = JOII.InterfaceBuilder('TestInterface2', {'extends': TestInterface}, {
        'public nullable number age2' : null
    });

    // Test the base interface.
    testException('TestInterface', {'protected nullable string name': ''}, 'Property name cannot be protected because the interface declared it public.');
    testException('TestInterface', {'public nullable string name': ''}, 'Class must implement protected number "age" as defined in the interface TestInterface.');
    testException('TestInterface', {'public nullable string name': '', 'public number age': null}, 'Property age cannot be public because the interface declared it protected.');
    testException('TestInterface', {'public nullable string name': '', 'protected number age': null, 'public myTest': function(a, b) {}}, 'Method myTest does not match the parameter count as defined in the interface TestInterface.');

    // Test the interface that extends on TestInterface.
    testException('TestInterface2', {'public nullable number age': null}, 'Class must implement public nullable number "age2" as defined in the interface TestInterface2.'); // From ChildTestInterface
    testException('TestInterface2', {'public nullable number age2': null}, 'Class must implement public nullable string "name" as defined in the interface TestInterface2.'); // From TestInterface2

    // An interface can be used to enforce types.
    var MTI = JOII.ClassBuilder({'implements': TestInterface}, {
        'public nullable string name' : null,
        'protected number age' : null,
        'public function myTest' : function(a) {}
    });

    var MyClass = JOII.ClassBuilder({
        'public nullable TestInterface ti' : null
    });

    assert.throws(function() {
        var m = new MyClass(); m.setTi(1);
    }, function(err) { return err === 'setTi expects an instance of TestInterface, number given.'; }, 'Exception is thrown when a setter is called and an argument with the wrong type was given.');
});
