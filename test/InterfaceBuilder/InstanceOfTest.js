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
test('InterfaceBuilder:InstanceOfTest', function(assert) {

    var I1 = JOII.InterfaceBuilder({});
    var I2 = JOII.InterfaceBuilder({});

    var c1Base = JOII.ClassBuilder({'implements': I1}, {});
    var c1 = new c1Base();
    assert.strictEqual(c1.instanceOf(c1Base), true, 'c1 is an instance of c1Base');
    assert.strictEqual(c1.instanceOf(I1), true, 'c1 is an instance of I1');
    assert.strictEqual(c1.instanceOf(I2), false, 'c1 is NOT an instance of I2');

    var c1Child = JOII.ClassBuilder({'extends': c1Base}, {});
    var c1a = new c1Child();
    assert.strictEqual(c1a.instanceOf(c1Base), true, 'c1a is an instance of c1Base');
    assert.strictEqual(c1a.instanceOf(c1Child), true, 'c1a is an instance of c1Child');
    assert.strictEqual(c1a.instanceOf(I1), true, 'c1a is an instance of I1');
    assert.strictEqual(c1a.instanceOf(I2), false, 'c1a is NOT an instance of I2');

    var c2Child = JOII.ClassBuilder({'extends': c1Child, 'implements' : [I2]}, {});
    var c1b = new c2Child();
    assert.strictEqual(c1b.instanceOf(c1Base), true, 'c1b is an instance of c1Base');
    assert.strictEqual(c1b.instanceOf(c1Child), true, 'c1b is an instance of c1Child');
    assert.strictEqual(c1b.instanceOf(I1), true, 'c1b is an instance of I1');
    assert.strictEqual(c1b.instanceOf(I2), true, 'c1b is an instance of I2');

    var c3Child = JOII.ClassBuilder({'extends': c1Base, 'implements' : [I2]}, {});
    var c1c = new c3Child();
    assert.strictEqual(c1c.instanceOf(c1Base), true, 'c1b is an instance of c1Base');
    assert.strictEqual(c1c.instanceOf(c1Child), false, 'c1b is NOT an instance of c1Child');
    assert.strictEqual(c1c.instanceOf(c2Child), false, 'c1b is NOT an instance of c2Child');
    assert.strictEqual(c1c.instanceOf(I1), true, 'c1b is an instance of I1');
    assert.strictEqual(c1c.instanceOf(I2), true, 'c1b is an instance of I2');

    assert.strictEqual(c1.instanceOf(I2), false, 'c1 is still NOT an instance of I2');
});
