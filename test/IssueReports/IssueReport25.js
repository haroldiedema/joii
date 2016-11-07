/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * Setter should return the public scope instead of the inner one for fluent
 * typing.
 */
test('IssueReports:IssueReport25', function(assert) {

    var root = JOII.ClassBuilder({
        'public object root_obj': {a: 42},
        'public object baz': { x: 0 }
    });

    var base = JOII.ClassBuilder({'extends': root}, {
        'public string foo': 'bar',
        'public object baz': { a: 1, b: 2 }, // Overwritten from root.
        'private string priv1': 'foo'
    });

    var child1 = JOII.ClassBuilder({'extends': base}, {
        'public object obj1': { a: 1, b: 2 },
        'public object obj2': { c: 1, d: 2 }
    });

    var child2 = JOII.ClassBuilder({'extends': base}, {
        'public object obj1': { a: 1, b: 2 },
        'public object obj2': { c: 1, d: 2 }
    });

    var test1 = new child1();
    var test2 = new child2();

    var success = true;

    // This should work.
    test1.setBaz({c: 1}).setRootObj({a: 84});

    assert.deepEqual(test1.getBaz(), {c: 1}, 'Value should be updated correctly.');
    assert.deepEqual(test1.getRootObj(), {a: 84}, 'Value should be updated correctly.');
    assert.deepEqual(test2.getRootObj(), {a: 42}, 'Value should be untouched.');

    try {
        test1.setFoo('hi').setPriv1('rawr');
    } catch (e) {
        success = false;
    }

    ok(! success, 'An exception should be thrown when trying to access a private member.');
});
