/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * Tests getters, setters and inheritance of instantiated class defintions.
 */
test('IssueReports:IssueReport16', function(assert) {
    var A = JOII.ClassBuilder({
        'public function f1': function() {},
        'public function type': function() {
            return 'A';
        },
        'public function f2': function() {
            this.f1();
            return this.type();
        }
    });
    var B = JOII.ClassBuilder({'extends': A}, {
        'public function type': function() {
            return 'B';
        }
    });
    var C = JOII.ClassBuilder({'extends': B}, {
    });

    var b = new B();
    var c = new C();

    assert.equal(b.f2(), 'B');
    assert.equal(c.f2(), 'B');  // Error happens here, it actually returns 'A'
});
