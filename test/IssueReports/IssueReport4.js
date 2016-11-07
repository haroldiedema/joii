/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

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
