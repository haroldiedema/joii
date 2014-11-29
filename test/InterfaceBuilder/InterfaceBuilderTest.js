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
 * This test does NOT test validation of interfaces on classes, but instead
 * tests the final result of the interface function based on the parameters
 * given to the InterfaceBuilder.
 */
test('InterfaceBuilder:InterfaceBuilderTest', function(assert) {

    var testDefinition = function(i, name) {
        assert.equal(typeof(i), 'function', 'Interface is available as a function.');
        assert.equal(typeof(i.definition), 'function', 'Interface definition is available as a function.');
        assert.equal(typeof(i.definition.__interface__), 'object', 'Interface metadata is available as an object.');
        assert.equal(typeof(i.definition.__interface__.name), 'string', 'Interface name is available as a string.');
        assert.equal(typeof(i.definition.__interface__.reflector), 'object', 'Interface definition reflector is available as an object.');
        assert.equal(typeof(i.definition.__interface__.prototype), 'object', 'Interface definition prototype is available as an object.');
        if (typeof(name) !== 'undefined') {
            assert.equal(i.definition.__interface__.name, name, 'Interface name is OK.');
        }
    };

    // Test empty interfaces
    testDefinition(JOII.InterfaceBuilder({}));
    testDefinition(JOII.InterfaceBuilder({}, {}));
    testDefinition(JOII.InterfaceBuilder('empty', {}, {}), 'empty');
    testDefinition(JOII.InterfaceBuilder('SomeInterfaceName'), 'SomeInterfaceName');
    testDefinition(JOII.InterfaceBuilder('AnotherInterfaceName', {}), 'AnotherInterfaceName');
});
