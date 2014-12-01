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
 * https://github.com/haroldiedema/joii/issues/9
 *
 * inheritance chain works strange
 * By dhs2dsh.
 */
test('IssueReports:IssueReport9', function(assert) {

    var output = '';

    var A = new JOII.ClassBuilder({
        test: function() {
            output += 'A';
        }
    });

    var B = new JOII.ClassBuilder({"extends": A}, {
        test: function() {
            this["super"]("test");
            output += 'B';
        }
    });

    var C = new JOII.ClassBuilder({"extends": B}, {});
    var c = new C();
    c.test();

    assert.equal(output, 'AB', 'Issue report 9 OK.');
});
