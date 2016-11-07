/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * Tests getters, setters and inheritance of instantiated class defintions.
 */
test('IssueReports:IssueReport15', function(assert) {
    var A = JOII.ClassBuilder({
        'public function f1': function() {},
        'public function f2': function() {
            this.f1();
        }
    });
    var B = JOII.ClassBuilder({'extends': A}, {
        'public function f3': function() {
            this.f2();
        },
    });
    var b = new B();
    b.f3();

    var reflector = new JOII.Reflection.Class(B);

    expect(0);
});
