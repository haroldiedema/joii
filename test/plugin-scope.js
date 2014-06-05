test('Plugins - Scope', function(assert) {

    // _____________________________________________________________________ //

    RegisterJOIIPlugin('test1', {
        supports: function() {
            return true;
        },
        scope: {
            test1: function() {
                return this.a + this.b;
            }
        }
    });

    var first = Class({ a: 0 });
    var second = Class({ 'extends': first }, { b: 1, __construct: function(a) { this.a = a; } });
    var s = new second(123);


    assert.equal('function', typeof(s.test1), 'Function from plugin injected in class scope.');
    assert.equal(123, s.a, 'First initial value of instantiated class is OK.');
    assert.equal(1, s.b, 'Second initial value of instantiated class is OK.');
    assert.equal(124, s.test1(), 'Value returned by plugin method based on object values is OK.');

    var third = Class({ 'extends': second }, {
        b: 10
    });
    var t = new third(1);
    assert.equal(1, t.a, 'First initial value of third object is OK.');
    assert.equal(11, t.test1(), 'Calculated result of plugin method is OK.');

});