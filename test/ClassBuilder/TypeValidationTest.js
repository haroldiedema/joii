/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * Tests visibility and accessibility of propreties.
 *
 * TODO: This could use some more work...
 */
test('ClassBuilder:TypeValidationTest', function(assert) {

    var TestClass = JOII.ClassBuilder('TestClass', {
        'public string a' : '',
        'public string b' : ''
    });

    var ChildTestClass = JOII.ClassBuilder({'extends': TestClass}, {});
    var t = new TestClass();
    var c = new ChildTestClass();

    // Base class definition.
    var VisibilityTestClass = JOII.ClassBuilder({
        'public TestClass test_class' : null
    });

    var v = new VisibilityTestClass();

    assert.throws(function() {
        v.setTestClass('rawr');
    }, function(err) { return err === 'setTestClass expects an instance of TestClass, string given.'; }, 'Class-type declaration used in setter validation.');

    // The following must NOT throw any exception.
    v.setTestClass(t);
    v.setTestClass(c);
});
