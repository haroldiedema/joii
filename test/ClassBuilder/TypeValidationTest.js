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
