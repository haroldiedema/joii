QUnit.test("class.constructor", function(assert) {
    
    var t_c = Class(function() {
        this.a = 0;
        this.b = 'foo';
        this.c = 'bar';
        
        this.__construct = function() {
            this.a = 1;
            this.c = this.c.toUpperCase();
        };
    });
    
    var c = new t_c();
    assert.equal(c.a, 1, 'read property overwritten by constructor');
    assert.equal(c.b, 'foo', 'read initial property value');
    assert.equal(c.c, 'BAR', 'read property overwritten by constructor');
});

