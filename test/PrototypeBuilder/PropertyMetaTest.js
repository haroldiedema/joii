/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

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

    // Test property descriptors get trimmed
    var pX;
    var px_meta;
    assert.ok((function() {
        try {
            pX = JOII.PrototypeBuilder(undefined, {}, {
                '          this_should_not_throw_an_error         ' : 'foo',
                '            thisShouldNotThrowAnError            ' : function() {},
                'boolean	tab_instead_of_spaces_should_not_fail'  : true
            });
            px_meta = pX.__joii__.metadata;

            return true; // test succeeded
        } catch (e) {
            console.error('Test "Property descriptors get trimmed" failed:', e);
            return false; // test failed
        }
    })(), 'Property descriptors get trimmed (see console output for error message)');

    assert.equal(px_meta && px_meta.this_should_not_throw_an_error.name,       'this_should_not_throw_an_error', 'this_should_not_throw_an_error: name OK.');
    assert.equal(px_meta && px_meta.this_should_not_throw_an_error.type,       null,                             'this_should_not_throw_an_error: type OK.');
    assert.equal(px_meta && px_meta.this_should_not_throw_an_error.visibility, 'public',                         'this_should_not_throw_an_error: is_public OK.');
    assert.equal(px_meta && px_meta.this_should_not_throw_an_error.is_abstract, false,                           'this_should_not_throw_an_error: is_abstract OK.');
    assert.equal(px_meta && px_meta.this_should_not_throw_an_error.is_final,    false,                           'this_should_not_throw_an_error: is_final OK.');
    assert.equal(px_meta && px_meta.thisShouldNotThrowAnError.name,       'thisShouldNotThrowAnError', 'thisShouldNotThrowAnError: name OK.');
    assert.equal(px_meta && px_meta.thisShouldNotThrowAnError.type,       null,                        'thisShouldNotThrowAnError: type OK.');
    assert.equal(px_meta && px_meta.thisShouldNotThrowAnError.visibility, 'public',                    'thisShouldNotThrowAnError: is_public OK.');
    assert.equal(px_meta && px_meta.thisShouldNotThrowAnError.is_abstract, false,                      'thisShouldNotThrowAnError: is_abstract OK.');
    assert.equal(px_meta && px_meta.thisShouldNotThrowAnError.is_final,    false,                      'thisShouldNotThrowAnError: is_final OK.');
    assert.equal(px_meta && px_meta.tab_instead_of_spaces_should_not_fail.name,       'tab_instead_of_spaces_should_not_fail', 'this_should_not_throw_an_error: name OK.');
    assert.equal(px_meta && px_meta.tab_instead_of_spaces_should_not_fail.type,       'boolean',                               'this_should_not_throw_an_error: type OK.');
    assert.equal(px_meta && px_meta.tab_instead_of_spaces_should_not_fail.visibility, 'public',                                'this_should_not_throw_an_error: is_public OK.');
    assert.equal(px_meta && px_meta.tab_instead_of_spaces_should_not_fail.is_abstract, false,                                  'this_should_not_throw_an_error: is_abstract OK.');
    assert.equal(px_meta && px_meta.tab_instead_of_spaces_should_not_fail.is_final,    false,                                  'this_should_not_throw_an_error: is_final OK.');

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
    }, function(err) { return err === 'Final member "test()" cannot be overwritten.'; }, 'Validate: Overriding final property.');
});
