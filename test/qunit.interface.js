QUnit.test("interface.missing-implementation", function(assert) {

    var HelloInterface = Interface({
        hello: 'function'
    });

    var HelloClass = Class({ implements: [HelloInterface] }, function() {
        // Missing implementation.
    });

    try {
        new HelloClass();
    } catch (e) {
        assert.equal(e, 'Missing function implementation: hello', 'Missing function implementation error');
    }

    var HelloClass2 = Class({ implements: [HelloInterface] }, function() {
        
        this.hello = function() {
            return 'foobar';
        }
        
    });

    var h = new HelloClass2();
    assert.equal(h.hello(), 'foobar', 'Implemented function from interface');
    
    var HelloInterface2 = Interface({
        hello2: 'function'
    });

    var HelloClass3 = Class({ implements: [HelloInterface, HelloInterface2] }, function() {
        
        this.hello = function() {
            return 'foobar';
        }
        
    });

    try {
        new HelloClass3();
    } catch (e) {
        assert.equal(e, 'Missing function implementation: hello2', 'Multiple interfaces on one class');
    }
});
