/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * Tests class property meta data and validation.
 */
test('PrototypeBuilder:ConstantTest', function(assert) {

    var p1 = JOII.PrototypeBuilder(undefined, {}, {
        'const FIRST' : 1,
        'const SECOND' : 2,
        'const THIRD' : 3
    });

    var p2 = JOII.PrototypeBuilder(undefined, {'extends': p1}, {
        'const FOURTH' : 4,
        'const FIFTH' : 5,
        'const SIXTH' : 6
    });

    var p3 = JOII.PrototypeBuilder(undefined, {'extends': p1}, {
        'const SEVENTH' : 7,
        'const EIGHTH' : 8,
        'const NINTH' : 9
    });

    assert.strictEqual(p1.__joii__.constants.FIRST, 1, 'FIRST is defined in p1');
    assert.strictEqual(p1.__joii__.constants.SECOND, 2, 'SECOND is defined in p1');
    assert.strictEqual(p1.__joii__.constants.THIRD, 3, 'THIRD is defined in p1');

    assert.strictEqual(p2.__joii__.constants.FIRST, 1, 'FIRST is defined in p2');
    assert.strictEqual(p2.__joii__.constants.SECOND, 2, 'SECOND is defined in p2');
    assert.strictEqual(p2.__joii__.constants.THIRD, 3, 'THIRD is defined in p2');
    assert.strictEqual(p2.__joii__.constants.FOURTH, 4, 'FOURTH is defined in p2');
    assert.strictEqual(p2.__joii__.constants.FIFTH, 5, 'FIFTH is defined in p2');
    assert.strictEqual(p2.__joii__.constants.SIXTH, 6, 'SIXTH is defined in p2');
    assert.strictEqual(typeof(p2.__joii__.constants.SEVENTH), 'undefined', 'SEVENTH is not defined in p2');
    assert.strictEqual(typeof(p2.__joii__.constants.EIGHTH), 'undefined', 'EIGHTH is not defined in p2');
    assert.strictEqual(typeof(p2.__joii__.constants.NINTH), 'undefined', 'NINTH is not defined in p2');

    assert.strictEqual(p3.__joii__.constants.FIRST, 1, 'FIRST is defined in p3');
    assert.strictEqual(p3.__joii__.constants.SECOND, 2, 'SECOND is defined in p3');
    assert.strictEqual(p3.__joii__.constants.THIRD, 3, 'THIRD is defined in p3');
    assert.strictEqual(p3.__joii__.constants.SEVENTH, 7, 'SEVENTH is defined in p3');
    assert.strictEqual(p3.__joii__.constants.EIGHTH, 8, 'EIGHTH is defined in p3');
    assert.strictEqual(p3.__joii__.constants.NINTH, 9, 'NINTH is defined in p3');
    assert.strictEqual(typeof(p3.__joii__.constants.FOURTH), 'undefined', 'FOURTH is not defined in p3');
    assert.strictEqual(typeof(p3.__joii__.constants.FIFTH), 'undefined', 'FIFTH is not defined in p3');
    assert.strictEqual(typeof(p3.__joii__.constants.SIXTH), 'undefined', 'SIXTH is not defined in p3');
});
