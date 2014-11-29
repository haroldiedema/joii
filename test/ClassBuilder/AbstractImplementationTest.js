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
* Tests inheritance of instantiated class defintions.
*/
test('ClassBuilder:AbstractImplementationTest', function(assert) {

    // An abstract property must also have a functional one in the same class.
    assert.throws(function() {
        var a = JOII.ClassBuilder({}, { 'abstract public function test' : function() {} }); new a();
    }, function(err) { return err === 'Missing abstract member implementation of "test".'; }, 'Validate: Missing implementation of abstract properties.');

    // An abstract property must be implemented by a child class.
    assert.throws(function() {
        var a = JOII.ClassBuilder({}, { 'abstract public function test' : function() {} });
        var b = JOII.ClassBuilder({ 'extends': a }, {}); new b();
    }, function(err) { return err === 'Missing abstract member implementation of "test".'; }, 'Validate: Missing implementation of abstract properties.');

    // Visibility of an abstract property may not change.
    assert.throws(function() {
        var a = JOII.ClassBuilder({}, { 'abstract public function test' : function() {} });
        var b = JOII.ClassBuilder({ 'extends': a }, { 'protected function test' : function() {} }); new b();
    }, function(err) { return err === 'Member "test" must be public as defined in the parent class.'; }, 'Validate: Visibility change of abstract implementation.');

    // This should _not_ throw an exception.
    var a = JOII.ClassBuilder({}, { 'abstract public function test' : function() {} });
    var b = JOII.ClassBuilder({ 'extends': a }, { 'public function test' : function() {} }); new b();

    // Defining an abstract and functional property in the same class is valid. (beware of declaration order)
    var c = JOII.ClassBuilder({}, {
        'abstract public function test' : function() {},
        'public function test' : function() {}
    });
    new c();

    // Implement abstract property in the middle of the inheritance chain.
    var c1 = JOII.ClassBuilder({}, { 'abstract public function test' : function() {} });
    var c2 = JOII.ClassBuilder({ 'extends' : c1 }, {});
    var c3 = JOII.ClassBuilder({ 'extends' : c2 }, { 'public function test' : function() {} });
    var c4 = JOII.ClassBuilder({ 'extends' : c3 }, {});

    // Should not throw exception for missing an abstract implementation.
    new c4();
});
