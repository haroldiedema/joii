test('Plugins - Compile', function(assert) {

    // _____________________________________________________________________ //

    RegisterJOIIPlugin('test3', {
        supports: function(product) {
            return product.prototype.a === 1;
        },
        compile: function(product) {
            product.prototype.a = 10;
        }
    });

    var first = Class({ a: 0 });
    var second = Class({ 'extends': first }, { a: 1 });
    var f = new first();
    var s = new second();

    assert.equal(0, f.a, 'Plugin did not recompile product of class (first).');
    assert.equal(10, s.a, 'Plugin correctly recompiled product of class (second).');

});