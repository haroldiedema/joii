QUnit.test("trait", function(assert) {

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
        __construct: function() {
            assert.equal(3, this.add(1, 2), 'Testing "add" function from math_trait');
            assert.equal(1, this.sub(2, 1), 'Testing "sub" function from math_trait');
            this.b();
        },
    
        b: function() {
            assert.equal('B', this.dummy('b'), 'Testing dummy trait');
        }
    })
    
    new a();
});
