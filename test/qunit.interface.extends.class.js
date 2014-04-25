QUnit.test("interface.extends", function(assert) {

    var HelloInterface1 = Interface({
        hello1: 'function'
    });
    
    var HelloInterface2 = Interface({ extends: HelloInterface1 }, {
        hello2: 'function'
    });
    
    var a = Class({ implements: [HelloInterface2] }, function() {});
    var b = Class({ implements: [HelloInterface2] }, function() { this.hello1 = function(){}});
    
    try {
        new a();
    } catch (e) {
        assert.equal(e, 'Missing function implementation: hello1', 'Missing implementation of parent interface.');
    }

    try {
        new b();
    } catch (e) {
        assert.equal(e, 'Missing function implementation: hello2', 'Missing implementation of child interface.');
    }
});
