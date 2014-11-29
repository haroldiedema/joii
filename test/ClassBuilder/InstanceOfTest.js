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
* Tests instanceOf functionality.
*/
test('ClassBuilder:InstanceOfTest', function(assert) {

    var cEmpty = JOII.ClassBuilder({});
    var c1 = new cEmpty();
    assert.strictEqual(c1.instanceOf(cEmpty), true, 'c1 is an instance of cEmpty');

    var cChild = JOII.ClassBuilder({'extends': cEmpty}, {});
    var c2 = new cChild();
    assert.strictEqual(c2.instanceOf(cEmpty), true, 'c2 is an instance of cEmpty');
    assert.strictEqual(c2.instanceOf(cChild), true, 'c2 is an instance of cChild');

    var cChild2 = JOII.ClassBuilder({'extends': cEmpty}, {});
    var c3 = new cChild2();
    assert.strictEqual(c3.instanceOf(cEmpty), true, 'c3 is an instance of cEmpty');
    assert.strictEqual(c3.instanceOf(cChild), false, 'c3 is NOT an instance of cChild');
    assert.strictEqual(c3.instanceOf(cChild2), true, 'c3 is an instance of cChild2');
});