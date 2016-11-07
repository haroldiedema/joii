/*
 Javascript Object                               ______  ________________
 Inheritance Implementation                  __ / / __ \/  _/  _/\_____  \
                                            / // / /_/ // /_/ /    _(__  <
 Copyright 2014, Harold Iedema.             \___/\____/___/___/   /       \
 --------------------------------------------------------------- /______  / ---
 Permission is hereby granted, free of charge, to any person obtaining  \/
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 ------------------------------------------------------------------------------
 */

/**
 * Setter should return the public scope instead of the inner one for fluent
 * typing.
 */
test('IssueReports:IssueReport25', function(assert) {

    var root = Class({
        'public object root_obj': {a: 42},
        'public object baz': { x: 0 }
    });

    var base = Class({'extends': root}, {
        'public string foo': 'bar',
        'public object baz': { a: 1, b: 2 }, // Overwritten from root.
        'private string priv1': 'foo'
    });

    var child1 = Class({'extends': base}, {
        'public object obj1': { a: 1, b: 2 },
        'public object obj2': { c: 1, d: 2 }
    });

    var child2 = Class({'extends': base}, {
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
