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
 * Tests the metadata validation of generated setters.
 */
test('ClassBuilder:SetterValidationTest', function(assert) {

    // Declaration of a class with a set of properties with defined types.
    // When a generated setter is called with a mismatched type as value, an
    // exception should be thrown.
    var MyClass = JOII.ClassBuilder({}, {
        'public number a_number': 1,
        'protected string b_protected_string': 'foo',
        'public object c_object': {'foo':'bar'},

        'public function setBString' : function(str) {
            this.setBProtectedString(str);
        },

        'public function getBString' : function() {
            return this.getBProtectedString();
        }
    });

    var a = new MyClass();

    // Verify that all getters and setters are properly generated with correct
    // visibility set on them.
    assert.equal(typeof(a.getANumber), 'function', 'Getter for property "a_number" exists.');
    assert.equal(typeof(a.getBProtectedString), 'undefined', 'Getter for property "b_protected_string" is private.');
    assert.equal(typeof(a.getCObject), 'function', 'Getter for property "c_object" exists.');
    assert.equal(typeof(a.getANumber), 'function', 'Setter for property "a_number" exists.');
    assert.equal(typeof(a.setBProtectedString), 'undefined', 'Setter for property "b_protected_string" is private.');
    assert.equal(typeof(a.setCObject), 'function', 'Setter for property "c_object" exists.');

    // Verify integrity of values through (custom) getters.
    assert.strictEqual(a.getANumber(), 1, 'Return value of getANumber is OK.');
    assert.strictEqual(a.getBString(), 'foo', 'Return value of getBString is OK.');
    assert.deepEqual(a.getCObject(), {'foo':'bar'}, 'Return value of getCObject is OK.');

    // Test calling setBProtectedString using the custom setter.
    a.setBString('rawr');
    assert.strictEqual(a.getBString(), 'rawr', 'Return value of getBString after modification is OK.');

    // If everything above works correctly, it's time to test the validation of
    // the property types in the generated setters. If a property is defined as
    // a string and a number-type value is passed to a setter, an exception is
    // thrown.
    assert.throws(function() { a.setANumber('This is not a number');
    }, function(err) { return err === 'setANumber expects number, string given.'; }, 'Setter type mismatch validator for setANumber is OK.');
    assert.throws(function() { a.setBString(123);
    }, function(err) { return err === 'setBProtectedString expects string, number given.'; }, 'Setter type mismatch validator for setBString is OK.');
    assert.throws(function() { a.setCObject('This is not an object');
    }, function(err) { return err === 'setCObject expects object, string given.'; }, 'Setter type mismatch validator for setCObject is OK.');
});
