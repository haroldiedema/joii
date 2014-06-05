test('Plugins - Support', function(assert) {

    // _____________________________________________________________________ //

    RegisterJOIIPlugin('test2', {

        supports: function(product) {
            return product.prototype.a === '1';
        },

        scope: {
            test2: function() {
                return parseInt(this.a) + parseInt(this.b);
            }
        }
    });

    var first = Class({ a: '0' });
    var second = Class({ 'extends': first }, { a: '1' });
    var f = new first();
    var s = new second();

    assert.equal('undefined', typeof(f.test2), 'Plugin function is not implemented in (first).');
    assert.equal('function', typeof(s.test2), 'Plugin function is implemented in (second).');

});
