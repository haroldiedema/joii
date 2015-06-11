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
 * Tests getters, setters and inheritance of instantiated class defintions.
 */
test('IssueReports:IssueReport11', function(assert) {
    var A = JOII.ClassBuilder({
        'public A': null,
        'public B': null,

        'public function f1': function() {
            this.setA('A');
        },
        'public function f2': function() {
            this.setB('B');
            this.f1();
        }
    });
    var B = Class({'extends': A}, {
        'public function f3': function() {
            this.f2();
        },
        'public function f4': function() {
            this.super('f2');
        }
    });
    var b = new B();
    assert.equal(typeof(b.f3), 'function', 'f3 exists on the child');
    assert.equal(typeof(b.f2), 'function', 'f2 exists on the child');
    assert.equal(typeof(b.f1), 'function', 'f1 exists on the child');
    b.f3();
    b.super('f2');
    b.super('f1');
    assert.equal(b.getA(), 'A', 'Parent method f1 called from parent within scope of child');
    assert.equal(b.getB(), 'B', 'Parent method f2 called within scope of child');
    var b2 = new B();
    assert.equal(b2.getA(), null, 'New instance of model property A set correctly');
    assert.equal(b2.getB(), null, 'New instance of model property B set correctly');
    b2.f4();
    assert.equal(b2.getA(), 'A', 'Parent method f1 called from parent within scope of child with use of "super"');
    assert.equal(b2.getB(), 'B', 'Parent method f2 called within scope of child with use of "super"');
});
