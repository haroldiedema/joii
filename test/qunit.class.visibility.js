QUnit.test("class.visibility", function(assert) {
    
    var c = Class({
        
        _iAmPrivate: 'I am private',
        iAmPublic: 'I am public',
        
        __construct: function() {
            assert.equal(this._iAmPrivate, 'I am private', 'Read private property from the constructor');
            
            this.test();
        },
        
        test: function() {
            // @todo FIXME! the ".parent" part of this should not be needed. Find another solution somehow.
            assert.equal(this.parent._iAmPrivate, 'I am private', 'Read private property from a method');
        }
    });

    var a = new c();
    a.test();
    
    assert.equal(typeof(a._iAmPrivate), 'undefined', 'Attempt to read an undefined property');
    assert.equal(a.iAmPublic, 'I am public', 'Attempt to read a public property');
    
    var b = Class({
        _iAmPrivate: 'I am private',
        iAmPublic: 'I am public'
    });
    
    var a = Class({extends: b}, {
        __construct: function() {
            assert.equal(typeof(a._iAmPrivate), 'undefined', 'Attempt to read a private property of a parent class.');
        }
    });
    
    new a();
});
