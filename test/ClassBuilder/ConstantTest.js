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
 * Tests class property meta data and validation.
 */
test('ClassBuilder:ConstantTest', function(assert) {

    var c1 = JOII.ClassBuilder({
        'const FIRST' : 1,
        'const SECOND' : 2,
        'const THIRD' : 3
    });

    var c2 = JOII.ClassBuilder({'extends': c1}, {
        'const FOURTH' : 4,
        'const FIFTH' : 5,
        'const SIXTH' : 6,

        __construct: function() {
            this.FOURTH = 3;
            assert.strictEqual(this.FOURTH, 4, 'this.FOURTH is still 4 after modification.');
        }
    });

    var c3 = JOII.ClassBuilder({'extends': c1}, {
        'const SEVENTH' : 7,
        'const EIGHTH' : 8,
        'const NINTH' : 9
    });

    assert.strictEqual(c1.FIRST, 1, 'FIRST is defined in c1');
    assert.strictEqual(c1.SECOND, 2, 'SECOND is defined in c1');
    assert.strictEqual(c1.THIRD, 3, 'THIRD is defined in c1');

    assert.strictEqual(c2.FIRST, 1, 'FIRST is defined in c2');
    assert.strictEqual(c2.SECOND, 2, 'SECOND is defined in c2');
    assert.strictEqual(c2.THIRD, 3, 'THIRD is defined in c2');
    assert.strictEqual(c2.FOURTH, 4, 'FOURTH is defined in c2');
    assert.strictEqual(c2.FIFTH, 5, 'FIFTH is defined in c2');
    assert.strictEqual(c2.SIXTH, 6, 'SIXTH is defined in c2');
    assert.strictEqual(typeof(c2.SEVENTH), 'undefined', 'SEVENTH is not defined in c2');
    assert.strictEqual(typeof(c2.EIGHTH), 'undefined', 'EIGHTH is not defined in c2');
    assert.strictEqual(typeof(c2.NINTH), 'undefined', 'NINTH is not defined in c2');

    assert.strictEqual(c3.FIRST, 1, 'FIRST is defined in c3');
    assert.strictEqual(c3.SECOND, 2, 'SECOND is defined in c3');
    assert.strictEqual(c3.THIRD, 3, 'THIRD is defined in c3');
    assert.strictEqual(c3.SEVENTH, 7, 'SEVENTH is defined in c3');
    assert.strictEqual(c3.EIGHTH, 8, 'EIGHTH is defined in c3');
    assert.strictEqual(c3.NINTH, 9, 'NINTH is defined in c3');
    assert.strictEqual(typeof(c3.FOURTH), 'undefined', 'FOURTH is not defined in c3');
    assert.strictEqual(typeof(c3.FIFTH), 'undefined', 'FIFTH is not defined in c3');
    assert.strictEqual(typeof(c3.SIXTH), 'undefined', 'SIXTH is not defined in c3');

    // Test writability
    c3.FIRST = 2;
    assert.strictEqual(c3.FIRST, 1, 'FIRST is still 1 in c3');
});
