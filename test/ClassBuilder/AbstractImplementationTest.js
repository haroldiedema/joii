/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
* Tests inheritance of instantiated class defintions.
*/
test('ClassBuilder:AbstractImplementationTest', function(assert) {

    // An abstract property must also have a functional one in the same class.
    assert.throws(function() {
        var a = JOII.ClassBuilder({}, { 'abstract public function test' : function() {} }); new a();
    }, function(err) { return err === 'Missing abstract member implementation of test()'; }, 'Validate: Missing implementation of abstract properties.');

    // An abstract property must be implemented by a child class.
    assert.throws(function() {
        var a = JOII.ClassBuilder({}, { 'abstract public function test' : function() {} });
        var b = JOII.ClassBuilder({ 'extends': a }, {}); new b();
    }, function(err) { return err === 'Missing abstract member implementation of test()'; }, 'Validate: Missing implementation of abstract properties.');

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
