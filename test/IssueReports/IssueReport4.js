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
 * https://github.com/haroldiedema/joii/issues/4
 *
 * Base class properties treated as static.
 * By jpravetz.
 */
test('IssueReports:IssueReport4', function(assert) {

    var Animal = JOII.ClassBuilder({
        type: 'animal',
        name: null,
        friends: [],
        __construct: function (type, name) {
            this.type = type;
            this.name = name;
        },
        addFriend: function (name) {
            this.friends.push(name);
        }
    });

    var Pet = JOII.ClassBuilder({'extends': Animal}, {
        breed: null,
        __construct: function (type,name, breed) {
            this['super']('__construct',type, name);
            this.breed = breed;
        }
    });

    var buffy = new Pet('dog','buffy', 'spoodle');
    var peaches = new Pet('cat','peaches','persian');
    buffy.addFriend('elfy');
    peaches.addFriend('pooh');

    assert.equal(buffy.getFriends().length, 1, 'Buffy has one friend.');
    assert.equal(peaches.getFriends().length, 1, 'Peaches has one friend.');
    assert.equal(buffy.getFriends()[0], 'elfy', 'Buffys friend is elfy.');
    assert.equal(peaches.getFriends()[0], 'pooh', 'Peaches friend is pooh.');
});
