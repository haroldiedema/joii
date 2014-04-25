QUnit.test("class.extends", function(assert) {
    var t_a = Class(function() {
        this.prop = 1;
    });
    
    var t_b = Class({ extends: t_a }, function() {
        this.__construct = function() {
            assert.equal(this.prop, 1, 'class b reads initial value of property of class a');
            this.prop = 2;
        };
    });
    
    var c = new t_b();
    assert.equal(c.prop, 2, 'class b overwrites property of a');
});
