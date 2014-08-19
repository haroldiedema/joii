test('Class - Inheriting (basic)', function(assert) {

    // _____________________________________________________________________ //

    var first = Class({ a: 0, __construct: function() { this.a = 1; } });
    var second = Class({'extends' : first }, { b: 1, __construct: function() { this.b = this.a + 1; this.a = 10; } });
    var third = Class({'extends' : second }, { c: 1, __construct: function() { this.c = this.b + 1; } });

    var f = new first();
    assert.equal(f.a, 1, 'Base class instance correctly instantiated');

    var s = new second();
    assert.equal(f.a, 1, 'Base (first) class property is unmodified.');
    assert.equal(s.a, 10, 'Child (second) class property is modified.');
    assert.equal(s.b, 1, 'Child (second) class property is modified by inherited value of (first).');

    var t = new third();
    assert.equal(t.c, 2, 'Child (third) class property is modified by inherited value of (first) and (second).');

    // _____________________________________________________________________ //

    var first2 = Class({
        a: 0,
        __construct: function() {
            this.a = 1;
        }
    });
    var second2 = Class({ 'extends' : first2 }, {
        b: 0,
        __construct: function() {
            this['super']('__construct');
            this.b = this.a + 1;
        }
    });
    s = new second2();
    assert.equal(s.a, 1, 'Parent constructor called using super(), modified property correctly');
    assert.equal(s.b, 2, 'Property correctly modified after calling parent constructor');

    // _____________________________________________________________________ //
    // Issue #4 - https://github.com/haroldiedema/joii/issues/4, by jpravetz

    var Animal = Class({
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

    var Pet = Class({ 'extends': Animal}, {
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

    assert.equal(buffy.friends.length, 1, "base argument not modified by 2nd child instance.");
    assert.equal(buffy.friends[0], 'elfy', "base object argument property copied.");

    assert.equal(peaches.friends.length, 1, "base argument not modified by 2nd child instance.");
    assert.equal(peaches.friends[0], 'pooh', "base object argument property copied.");

    var B1 = Class({
        my_array: [],
        my_object: [{}],
        set: function(a, b) { this.my_object[0][a] = b; },
        get: function(a) { return this.my_object[0][a]; },
        add: function(a){ this.my_array.push(a); }
    });

    var C1 = Class({ 'extends': B1 }, {});
    var C2 = Class({ 'extends': B1 }, {});

    var i1 = new C1();
    var i2 = new C2();

    i1.set('a', 'b');
    i1.add('array');
    assert.equal(i1.get('a'), 'b', 'Object-copy check OK.');
    assert.equal(typeof(i2.get('a')), 'undefined', 'Object-copy check OK on second reference.');

    // _____________________________________________________________________ //
    // Issue #6 - https://github.com/haroldiedema/joii/issues/6, by georgePadolsey
    
    var errorMessage = '';


    // ___ Interfaces used in the following examples ___

    var i1 = Interface({
        m1: 'string',
        m2: 'string'
    });

    var i2 = Interface({
        'extends': i1
    },
    {
        m1: 'function',
        // Where m2 would be (semantical) //
        m3: 'string'
    });

    // ____________ #1 Test of Interface Extension __________
    

    var c1 = Class({
        'implements': i2 
    }, {
        m1: function() {},
        m3: ''
    });

    try {
        new c1();
    } catch(e) {
        errorMessage = e.message;
    }

    assert.equal(errorMessage, 'Class is missing string implementation of property \"m2\".', 'Intefaces that extend other interfaces still work as usual with classes (requiring implementation)');

    // ____________ #2 Test of Interface Extension ___________

    errorMessage = ''
    var c2 = Class({
        'implements': i2 
    }, {
        m1: 'I should be a function',
        m2: '',
        m3: ''
    });

    try {
        new c2();
    } catch(e) {
        errorMessage = e.message;
    }

    assert.equal(errorMessage, 'Property \"m1\" must be of type \"function\", string detected.', 'When an interface is extended properties are correctly overrided.');

    // ____________ #3 Test of Interface Extension ___________

    errorMessage = ''
    var c2 = Class({
        'implements': i2 
    }, {
        m1: function() {},
        m2: ''
    });

    try {
        new c2();
    } catch(e) {
        errorMessage = e.message;
    }

     assert.equal(errorMessage, 'Class is missing string implementation of property \"m3\".', 'New properties are added from the interface that is being extended.');
});
