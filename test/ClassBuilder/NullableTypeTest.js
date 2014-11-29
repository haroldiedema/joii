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
 * Tests the metadata validation of a nullable type.
 */
test('ClassBuilder:NullableTypeTest', function(assert) {

    // Delcaration of a class with nullable types.
    var MyClass = JOII.ClassBuilder({}, {
        'public nullable number a': 1,
        'public nullable object b': null
    });

    var a = new MyClass();

    assert.strictEqual(a.getA(), 1, 'Initial value of nullable type "a" is OK.');
    assert.strictEqual(a.getB(), null, 'Initial value of nullable type "b" is OK.');

    // If the nullable type works correctly, this should not throw an invalid
    // type exception:
    a.setA(null);
    assert.strictEqual(a.getA(), null, 'Updated value of nullable type "a" is OK.');

    // .. But this would:
    assert.throws(function() {
        a.setA("rawr");
    }, function(err) { return err === 'setA expects number, string given.'; }, 'Nullable mismatch exception thrown OK.');
});
