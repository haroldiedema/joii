QUnit.test("trait.extends", function(assert) {

    var math_trait = {
        add: function(a, b) {
            return a + b;
        },
        sub: function(a, b) {
            return a - b;
        }
    }
    
    var dummy_trait = {
        dummy: function(a) {
            return a.toUpperCase();
        }
    }
    
    var dummy_trait2 = {
            dummy2: function(a) {
                return a.toUpperCase();
            }
        }
    
    var a = Class({ uses: [math_trait, dummy_trait]}, {
        b: function() {
            assert.equal('B', this.dummy('b'), 'Testing dummy trait, called from child class');
        }
    })
    
    new a();
    
    var b = Class({ extends: a }, {
        
        __construct: function() {
            this.b();
            assert.equal(5, this.add(3, 2), 'Calling "add" on parent class which uses math_trait');
        }
        
    });
    
    new b();
});
