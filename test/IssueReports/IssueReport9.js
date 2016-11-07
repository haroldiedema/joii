/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * https://github.com/haroldiedema/joii/issues/9
 *
 * inheritance chain works strange
 * By dhs2dsh.
 */
test('IssueReports:IssueReport9', function(assert) {

    var output = '';

    var A = new JOII.ClassBuilder({
        test: function() {
            output += 'A';
        }
    });

    var B = new JOII.ClassBuilder({"extends": A}, {
        test: function() {
            this["super"]("test");
            output += 'B';
        }
    });

    var C = new JOII.ClassBuilder({"extends": B}, {});
    var c = new C();
    c.test();

    assert.equal(output, 'AB', 'Issue report 9 OK.');
});
