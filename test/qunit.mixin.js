QUnit.test("mixin", function(assert) {

    var math_trait = {
        add: function(a, b) {
            return a + b;
        }
    };
    
    var math2 = function() {
        this.add2 = function(a, b) {
            return a + b;
        }
    };
    
    
    var a = Class({

        a: 10,
        b: 20,

        getA: function() { return this.a },
        getB: function() { return this.b }

    });
    
    var obj = new a();
    obj.mixin(math_trait);
    assert.equal(30, obj.add(obj.getA(), obj.getB()), 'Test mixin static object');
    
    obj.mixin(new math2);
    assert.equal(30, obj.add2(obj.getA(), obj.getB()), 'Test mixin instantiated object');

});
