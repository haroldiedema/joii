QUnit.test("interface.extends.class", function(assert) {

    var HelloInterface1 = Interface({
        hello1: 'function'
    });
    
    var HelloInterface2 = Interface({ extends: HelloInterface1 }, {
        hello2: 'function'
    });
    
    var a = Class({ implements: [HelloInterface2] }, function() {
        this.hello1 = function(){}
    });
    var b = Class({ extends: a }, function() { 
        this.hello1 = function(){}
    });

    try {
        new b();
    } catch (e) {
        assert.equal(e, 'Missing function implementation: hello2', 'Missing implementation of child interface in parent class.');
    }
});
