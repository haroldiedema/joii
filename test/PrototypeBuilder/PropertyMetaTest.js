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
test('PrototypeBuilder:PropertyMetaTest', function(assert) {

    var proto = JOII.PrototypeBuilder('Test', {}, {
        'defaults'                                      : 1,
        'protected function i_am_protected'             : function() {},
        'final protected function i_am_final_protected' : function() {},
        'abstract public function i_am_abstract_func'   : function() {}
    });

    var meta = proto.__joii__.metadata;

    // Test integrity of metadata properties.
    assert.equal(meta.defaults.name, 'defaults', 'Defaults: name OK.');
    assert.equal(meta.defaults.type, null, 'Defaults: type OK.');
    assert.equal(meta.defaults.visibility, 'public', 'Defaults: is_public OK.');
    assert.equal(meta.defaults.is_abstract, false, 'Defaults: is_abstract OK.');
    assert.equal(meta.defaults.is_final, false, 'Defaults: is_final OK.');
    assert.equal(meta.i_am_protected.name, 'i_am_protected', 'i_am_protected: name OK.');
    assert.equal(meta.i_am_protected.type, 'function', 'i_am_protected: type OK.');
    assert.equal(meta.i_am_protected.visibility, 'protected', 'i_am_protected: is_public OK.');
    assert.equal(meta.i_am_protected.is_abstract, false, 'i_am_protected: is_abstract OK.');
    assert.equal(meta.i_am_protected.is_final, false, 'i_am_protected: is_final OK.');
    assert.equal(meta.i_am_final_protected.name, 'i_am_final_protected', 'i_am_final_protected: name OK.');
    assert.equal(meta.i_am_final_protected.type, 'function', 'i_am_final_protected: type OK.');
    assert.equal(meta.i_am_final_protected.visibility, 'protected', 'i_am_final_protected: is_public OK.');
    assert.equal(meta.i_am_final_protected.is_abstract, false, 'i_am_final_protected: is_abstract OK.');
    assert.equal(meta.i_am_final_protected.is_final, true, 'i_am_final_protected: is_final OK.');
    assert.equal(meta.i_am_abstract_func.name, 'i_am_abstract_func', 'i_am_abstract_func: name OK.');
    assert.equal(meta.i_am_abstract_func.type, 'function', 'i_am_abstract_func: type OK.');
    assert.equal(meta.i_am_abstract_func.visibility, 'public', 'i_am_abstract_func: is_public OK.');
    assert.equal(meta.i_am_abstract_func.is_abstract, true, 'i_am_abstract_func: is_abstract OK.');
    assert.equal(meta.i_am_abstract_func.is_final, false, 'i_am_abstract_func: is_final OK.');

    // Test validation of wrong combination of flags:

    // Multiple type definitions are not allowed.
    assert.throws(function() {
        JOII.PrototypeBuilder('Test', {}, { 'public number string test' : 1 });
    }, function(err) { return err === 'Property "test" has multiple type defintions.'; }, 'Validate: multiple type definitions');

    // A property cannot be protected and public at the same time.
    assert.throws(function() {
        JOII.PrototypeBuilder('Test', {}, { 'protected public function test' : function() {} });
    }, function(err) { return err === 'Property "test" cannot be both protected and public at the same time.'; }, 'Validate: protected + public');

    // A property cannot be abstract and final at the same time.
    assert.throws(function() {
        JOII.PrototypeBuilder('Test', {}, { 'final abstract function test' : function() {} });
    }, function(err) { return err === 'Property "test" cannot be both abstract and final at the same time.'; }, 'Validate: abstract + final');

    // Some invalid property flag that doesn't exist...
    assert.throws(function() {
        JOII.PrototypeBuilder('Test', {}, { 'foobar test' : function() {} });
    }, function(err) { return err === 'Syntax error: unexpected "foobar" in property declaration of "test".'; }, 'Validate: Undefined flags.');

    // Test inheritance modifiers: changing visibility, final, abstract:

    // Visibility on properties may not change through the inheritance chain.
    assert.throws(function() {
        var a = JOII.PrototypeBuilder('Test', {}, { 'protected function test' : function() {} });
        JOII.PrototypeBuilder('Test', { 'extends': a }, { 'public function test' : function() {} });
    }, function(err) { return err === 'Member "test" must be protected as defined in the parent class.'; }, 'Validate: Visibility overruling.');

    // A final property may not be overwritten by a child class.
    assert.throws(function() {
        var a = JOII.PrototypeBuilder('Test', {}, { 'final protected function test' : function() {} });
        JOII.PrototypeBuilder('Test', { 'extends': a }, { 'protected function test' : function() {} });
    }, function(err) { return err === 'Final member "test" cannot be overwritten.'; }, 'Validate: Overriding final property.');
});
