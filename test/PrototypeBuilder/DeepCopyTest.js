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
 * Test the basic functionality of the PrototypeBuilder. If all works as
 * expected, modifying the returned prototype will _not_ affect the
 * original object in any way.
 *
 * Because JavaScript creates pointers for every object, this is not
 * native behavoir. However, in order to make inheritance work properly,
 * this is something JOII needs to work properly.
 */
test('PrototypeBuilder:DeepCopyTest', function(assert) {

    // Our 'base' object. This object must stay intact after modifying the
    // generated prototype returned from the PrototypeBuilder.
    var object = {
        a_string        : "Hello World",
        a_number        : 123,
        an_array        : [1, 2, 3],
        an_object       : { a: 1, b: 2, c: 3 },
        a_nested_array  : [1, [1,2,3], 2, 3],
        a_nested_object : {a: 1, b: { a1: 1, b1: 2, c1: 3 }, c: 3}
    };
    var proto = JOII.PrototypeBuilder('Test', {}, object);

    // Make sure the original object contains the exact same contents as the
    // generated prototype object.
    assert.strictEqual(proto.a_string, object.a_string, 'a_string is equal in object and proto.');
    assert.strictEqual(proto.a_number, object.a_number, 'a_number is equal in object and proto.');
    assert.deepEqual(proto.an_array, object.an_array, 'an_array is equal in object and proto.');
    assert.deepEqual(proto.an_object, object.an_object, 'an_array is equal in object and proto.');
    assert.deepEqual(proto.a_nested_array, object.a_nested_array, 'a_nested_array is equal in object and proto.');
    assert.deepEqual(proto.a_nested_object, object.a_nested_object, 'a_nested_object is equal in object and proto.');

    // Modify the prototype object and make sure the original object stays intact.
    proto.a_string        = "Foobar";
    proto.a_number        = 456;
    proto.an_array        = [4, 5, 6];
    proto.an_object       = { a: 4, b: 5, c: 6};
    proto.a_nested_array  = [[1, 2, 3], [1, 2]];
    proto.a_nested_object = {foo: {a: 1, b: 2}, bar: {c: 3, d: 4}};

    // Assert the original object contents.
    assert.strictEqual("Hello World", object.a_string, 'a_string is intact');
    assert.strictEqual(123, object.a_number, 'a_number is intact');
    assert.deepEqual([1, 2, 3], object.an_array, 'an_array is intact');
    assert.deepEqual({ a: 1, b: 2, c: 3 }, object.an_object, 'an_object is intact');
    assert.deepEqual([1, [1,2,3], 2, 3], object.a_nested_array, 'a_nested_array is intact');
    assert.deepEqual({a: 1, b: { a1: 1, b1: 2, c1: 3 }, c: 3}, object.a_nested_object, 'a_nested_object is intact');
});
