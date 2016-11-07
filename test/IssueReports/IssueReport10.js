/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * https://github.com/haroldiedema/joii/issues/10
 *
 * Getters/setters of properties from parent classes are
 * not inherited properly.
 */
test('IssueReports:IssueReport10', function(assert) {

    var A = JOII.ClassBuilder({
        'public string text': 'nothing',
        __construct: function() {
            this.setText('test');
        }
    });

    var B = JOII.ClassBuilder({'extends': A}, {
        __construct: function() {
            this['super']('__construct');
        }
    });

    var a = new A();
    assert.equal('test', a.getText(), 'a.getText works.');

    var b = new B();
    assert.equal('test', b.getText(), 'b.getText works.');

});
