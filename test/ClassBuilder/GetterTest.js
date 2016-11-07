/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * Tests name generation of Getter methods.
 */
test('ClassBuilder:GetterTest', function(assert) {

    var c1 = JOII.ClassBuilder({
        'public string my_name'      : 'Harold',
        'public boolean enabled'     : true,
        'public boolean is_disabled' : false
    });

    var c = new c1();

    assert.strictEqual(typeof(c.getMyName), 'function', 'getMyName exists');
    assert.strictEqual(typeof(c.isEnabled), 'function', 'isEnabled exists');
    assert.strictEqual(typeof(c.isDisabled), 'function', 'isDisabled exists');
});
