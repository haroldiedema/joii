/*
Javascript Object                               ______  ________________
Inheritance Implementation                  __ / / __ \/  _/  _/\_____  \
                                           / // / /_/ // /_/ /    _(__  <
Copyright 2014, Harold Iedema.             \___/\____/___/___/   /       \
--------------------------------------------------------------- /______  / ---
Permission is hereby granted, free of charge, to any person obtaining  \/
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
------------------------------------------------------------------------------
*/

/**
 * Tests class property meta data and validation.
 */
test('PrototypeBuilder:TraitTest', function(assert) {

    var t1 = {
        add: function(a, b) {
            return a + b;
        }
    };

    var c = JOII.ClassBuilder({ 'uses': t1 }, {
        a: 0,
        __construct: function() {
            this.a = this.add(1,2);
        }
    });

    var c1 = new c();
    assert.equal(3, c1.getA(), 'Trait applied correctly.');

    // _____________________________________________________________________ //

    var d = JOII.ClassBuilder({'extends': c}, {
        __construct: function() {
            this.a = this.add(38, 4);
        }
    });
    var d1 = new d();
    assert.equal(42, d1.getA(), 'Trait declared in parent class is usable from child class.');

    // _____________________________________________________________________ //

    var e = JOII.ClassBuilder({
        a: 0,
        __construct: function() {
            this.a = this.add(38, 4);
        }
    });
    var f = JOII.ClassBuilder({'extends': e, 'uses': t1}, {});

    var f1 = new f();
    assert.equal(42, f1.getA(), 'Trait declared in child class is usable from parent class.');

    var g = JOII.ClassBuilder({'extends': e, 'uses': t1}, {
        __construct: function() {
            this['super']('__construct');
        }
    });
    var g1 = new g();
    assert.equal(42, g1.getA(), 'Trait called correctly from child constructer which called parent contructor.');

});