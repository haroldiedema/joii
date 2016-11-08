/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
* Tests function overloading
*/
test('ClassBuilder:FunctionOverloadingTests', function(assert) {

    try {
        // ***************************
        // Abstract tests
        // ***************************

        // An abstract property must also have a functional one in the same class.
        assert.throws(function() {
            var a = JOII.ClassBuilder({}, { 'abstract public function test(string)': function() { } }); new a();
        }, function(err) { return err === 'Missing abstract member implementation of test(string)'; }, 'Validate: Missing implementation of abstract properties.');

        // An abstract property must be implemented by a child class.
        assert.throws(function() {
            var a = JOII.ClassBuilder({}, { 'abstract public function test(string)': function() { } });
            var b = JOII.ClassBuilder({ 'extends': a }, {}); new b();
        }, function(err) { return err === 'Missing abstract member implementation of test(string)'; }, 'Validate: Missing implementation of abstract properties.');

        // An abstract property must be implemented by a child class.
        assert.throws(function() {
            var a = JOII.ClassBuilder({}, {
                'abstract public function test(number)': function() { },
                'abstract public function test(string)': function() { }
            });
            var b = JOII.ClassBuilder({ 'extends': a }, {
                'public function test(string)': function() { }
            }); new b();
        }, function(err) { return err === 'Missing abstract member implementation of test(number)'; }, 'Validate: Missing implementation of abstract properties.');

        // An abstract property must be implemented by a child class.
        assert.throws(function() {
            var a = JOII.ClassBuilder({}, {
                'abstract public function test(number)': function() { },
                'abstract public function test(string)': function() { }
            });
            var b = JOII.ClassBuilder({ 'extends': a }, {
                'public function test(number)': function() { }
            }); new b();
        }, function(err) { return err === 'Missing abstract member implementation of test(string)'; }, 'Validate: Missing implementation of abstract properties (different order).');

        // Visibility of an abstract property may not change.
        assert.throws(function() {
            var a = JOII.ClassBuilder({}, { 'abstract public function test(string)': function() { } });
            var b = JOII.ClassBuilder({ 'extends': a }, { 'protected function test(string)': function() { } }); new b();
        }, function(err) { return err === 'Member "test" must be public as defined in the parent class.'; }, 'Validate: Visibility change of abstract implementation.');

        // This should _not_ throw an exception.
        var a = JOII.ClassBuilder({}, {
            'abstract public function test(number)': function() { },
            'abstract public function test(string)': function() { }
        });
        var b = JOII.ClassBuilder({ 'extends': a }, {
            'public function test(number)': function() { },
            'public function test(string)': function() { }
        });
        new b();

        // Defining an abstract and functional property in the same class is valid. (beware of declaration order)
        var c = JOII.ClassBuilder({}, {
            'abstract public function test(string)': function() { },
            'public function test(string)': function() { }
        });
        new c();

        // Implement abstract property in the middle of the inheritance chain.
        var c1 = JOII.ClassBuilder({}, { 'abstract public function test(string)': function() { } });
        var c2 = JOII.ClassBuilder({ 'extends': c1 }, {});
        var c3 = JOII.ClassBuilder({ 'extends': c2 }, { 'public function test(string)': function() { } });
        var c4 = JOII.ClassBuilder({ 'extends': c3 }, {});

        // Should not throw exception for missing an abstract implementation.
        new c4();


        // ***************************
        // Call tests
        // ***************************

        var C1 = JOII.ClassBuilder({
            '__call(number)': function(p) { return 1 + p; },
            '__call(string)': function(p) { return p + " passed"; }
        });
        assert.strictEqual(C1(1), 2, '__call number overload function OK.');
        assert.strictEqual(C1("test"), "test passed", '__call string overload function OK.');

        // __call may not return "this", because it references to the static
        // definition of the class body.
        assert.throws(function() {
            var a = JOII.ClassBuilder({ 'public function foo': function() { }, '__call(number)': function() { return this; } }); a(1);
        }, function(err) { return err === '__call cannot return itself.'; }, '__call cannot return itself.');

        // Test the context of a static call.
        var C2 = JOII.ClassBuilder({
            a: 1,
            b: "test",

            '__call(number)': function(val) {
                this.a = val;
            },
            '__call(string)': function(val) {
                this.b = val;
            }
            ,
            '__call()': function() {
                return this.a;
            }
        });

        var c2 = new C2();
        assert.strictEqual(c2.getA(), 1, 'c2.getA() returns this.a (1)');
        assert.strictEqual(c2.getB(), "test", 'c2.getB() returns this.b ("test")');
        assert.strictEqual(C2(), 1, '__call returns this.a (1)');


        // Update the value, THEN create another instance and check again...
        C2(2);
        C2("test again");
        var c2a = new C2();
        assert.strictEqual(C2(), 2, '__call returns this.a (2)');
        assert.strictEqual(c2.getA(), 1, 'c2.getA() returns this.a (1)');
        assert.strictEqual(c2a.getA(), 1, 'c2a.getA() returns this.a (1)');
        assert.strictEqual(c2.getB(), "test", 'c2.getB() returns this.b ("test")');
        assert.strictEqual(c2a.getB(), "test", 'c2a.getB() returns this.b ("test")');


        // 3.1.0: Custom callable method names.

        var C3 = Class({
            '<>(number)': function(val) { return val + 1; },
            '<>(string)': function(val) { return val + " passed"; }
        });
        assert.strictEqual(C3(4), 5, 'New default call number overload method "<>" used.');
        assert.strictEqual(C3("test"), "test passed", 'New default call string overload method "<>" used.');

        JOII.Config.addCallable('execute');
        var C4 = Class({
            'execute(number)': function(val) { return val + 1; },
            'execute(string)': function(val) { return val + " passed"; }
        });
        assert.strictEqual(C4(4), 5, 'Custom call number overload method "execute" used.');
        assert.strictEqual(C4("test"), "test passed", 'Custom call string overload method "execute" used.');
        JOII.Config.removeCallable('execute');



        // ***************************
        // General overloading tests
        // ***************************



        var UniqueTestClass = JOII.ClassBuilder('UniqueTestClass', {
            x: 6,
            y: "something else"
        });

        var SuperClass = JOII.ClassBuilder('SuperClass', {
            a: 1,
            b: "test",

            'test(number)': function(val) {
                this.a = val;
            },
            'test(string)': function(val) {
                this.b = val;
            },
            'test(UniqueTestClass)': function(val) {
                this.a = val.getX();
                this.b = val.getY();
            },
            'test(object)': function(val) {
                if ('a' in val) {
                    this.a = val.a;
                }
                if ('b' in val) {
                    this.b = val.b;
                }
            }
        });

        var sc = new SuperClass();

        sc.test(2);
        assert.strictEqual(sc.getA(), 2, 'sc.getA() returns this.a (2)');

        sc.test("success");
        assert.strictEqual(sc.getB(), "success", 'sc.getB() returns this.b ("success")');

        sc.test({ a: 5, b: "passed" });
        assert.strictEqual(sc.getA(), 5, 'sc.getA() returns this.a (5)');
        assert.strictEqual(sc.getB(), "passed", 'sc.getB() returns this.b ("passed")');


        var testClass = new UniqueTestClass();
        sc.test(testClass);
        assert.strictEqual(sc.getA(), 6, 'sc.getA() returns this.a (6)');
        assert.strictEqual(sc.getB(), "something else", 'sc.getB() returns this.b ("something else")');


        var SubClass1 = JOII.ClassBuilder('SubClass1', { 'extends': SuperClass }, {
            'test(number)': function(val) {
                this.a = val * 2;
            },
            'test(number, string)': function(num, str) {
                this.a = num * 4;
                this.b = str + " passed";
            },
            'test(string, number)': function(str, num) {
                this.test(num);
                this.test(str);
            }
        });


        var subc = new SubClass1();

        // first, test the methods that were inherited and not overridden
        subc.test("success");
        assert.strictEqual(subc.getB(), "success", 'subc.getB() returns this.b ("success")');

        subc.test({ a: 5, b: "passed" });
        assert.strictEqual(subc.getA(), 5, 'subc.getA() returns this.a (5)');
        assert.strictEqual(subc.getB(), "passed", 'subc.getB() returns this.b ("passed")');

        // test override
        subc.test(5);
        assert.strictEqual(subc.getA(), 10, 'subc.getA() returns this.a (10)');

        // test added overload
        subc.test(10, "testing");
        assert.strictEqual(subc.getA(), 40, 'subc.getA() returns this.a (40)');
        assert.strictEqual(subc.getB(), "testing passed", 'subc.getB() returns this.b ("testing passed")');

        // test overload calling different overloads, from different levels of inheritance
        subc.test("asdf", 100);
        assert.strictEqual(subc.getA(), 200, 'subc.getA() returns this.a (200)');
        assert.strictEqual(subc.getB(), "asdf", 'subc.getB() returns this.b ("asdf")');


        var CustomClass = JOII.ClassBuilder('CustomClass', {
            'SubClass1 custom': null,
            'construct(number)': function(num) {
                this.custom = new SubClass1();
                this.custom.test(num);
            },
            'construct(string)': function(str) {
                this.custom = new SubClass1();
                this.custom.test(str);
            },
            'construct(number, string)': function(num, str) {
                this.custom = new SubClass1();
                this.custom.test(num, str);
            },
            'test(number)': function(num) {
                this.custom.test(num);
            },
            'test(string)': function(str) {
                this.custom.test(str);
            },
            'test(SubClass1)': function(val) {
                this.custom = val;
            }
        });

        var custom1 = new CustomClass(5);
        assert.strictEqual(custom1.getCustom().getA(), 10, 'custom1.getCustom().getA() returns this.custom.a (10)');

        var custom2 = new CustomClass("success");
        assert.strictEqual(custom2.getCustom().getB(), "success", 'custom1.getCustom().getB() returns this.custom.a ("success")');


        subc.test("asdf", 100);
        custom2.test(subc);
        assert.strictEqual(custom2.getCustom().getA(), 200, 'custom2.getCustom().getA() returns this.custom.a (200)');
        assert.strictEqual(custom2.getCustom().getB(), "asdf", 'custom2.getCustom().getB() returns this.custom.b ("asdf")');



        assert.throws(function() {
            custom2.test(1, 2, 3, 4);
        }, function(err) { return err === 'Couldn\'t find a function handler to match: test(number, number, number, number).'; }, 'Validate: No matching overload.');

        assert.throws(function() {
            var c5 = JOII.ClassBuilder({
                'construct( number )': function(num) { },
                'construct(number)': function(num) { }
            });
            new c5();
        }, function(err) { return err === 'Member construct(number) is defined twice.'; }, 'Validate: Duplicate function overload.');

        assert.throws(function() {
            var c6 = JOII.ClassBuilder({
                'public test(number)': function(num) { },
                'private test(number)': function(num) { }
            });
            new c6();
        }, function(err) { return err === 'Member test: inconsistent visibility.'; }, 'Validate: Consistent visibility of overloads.');

        assert.throws(function() {
            var c7 = JOII.ClassBuilder({
                'test(number)': function(num) { },
                'test(str)': 'invalid'
            });
            new c7();
        }, function(err) { return err === 'Member test specifies parameters, but it\'s value isn\'t a function.'; }, 'Validate: Function body.');

        assert.throws(function() {
            var c8 = JOII.ClassBuilder({
                'test(number)': function(num) { },
                'test': 'invalid'
            });
            new c8();
        }, function(err) { return err === 'Member test overloads an existing function, but it\'s value isn\'t a function.'; }, 'Validate: Consistent overloads.');

        assert.throws(function() {
            var c9 = JOII.ClassBuilder({
                'test': 'invalid',
                'test(number)': function(num) { }
            });
            new c9();
        }, function(err) { return err === 'Member test overloads an existing property, but the previous property isn\'t a function.'; }, 'Validate: Consistent overloads (reverse order).');


        // ***************************
        // Variadic overloading tests
        // ***************************


        var C10 = JOII.ClassBuilder({
            'variadic(number)': function(num) {
                return "variadic (number): " + num;
            },
            'variadic(number, string)': function(num, str) {
                return "variadic (number, string): " + str + ": " + num;
            },
            'variadic(number, ...)': function(num, args) {
                return "variadic (number, ...): " + num + ' = ' + args.join(', ');
            },
            'variadic(number, string, ...)': function(num, str, args) {
                return "variadic (number, string, ...): " + str + ": " + num + ' = ' + args.join(', ');
            }
        });
        var c10 = new C10();

        assert.strictEqual(c10.variadic(1), "variadic (number): 1", 'c10.variadic(1) returns variadic (number): 1');
        assert.strictEqual(c10.variadic(1, "Test"), "variadic (number, string): Test: 1", 'c10.variadic(1, "Test") returns variadic (number, string): Test: 1');

        assert.strictEqual(c10.variadic(1, 2), "variadic (number, ...): 1 = 2", 'c10.variadic(1, 2) returns "variadic (number, ...): 1 = 2"');
        assert.strictEqual(c10.variadic(1, 2, "asdf"), "variadic (number, ...): 1 = 2, asdf", 'c10.variadic(1, 2, "asdf") returns "variadic (number, ...): 1 = 2, asdf"');
        assert.strictEqual(c10.variadic(1, "asdf", 2, 3), "variadic (number, string, ...): asdf: 1 = 2, 3", 'c10.variadic(1, "asdf", 2, 3) returns "variadic (number, string, ...): asdf: 1 = 2, 3"');


        assert.throws(function() {
            var c11 = JOII.ClassBuilder({
                'variadic(string, ..., string)': function(num, str, args) { }
            });
            new c11();
        }, function(err) { return err === 'Member variadic: Variadic parameter (...) must be the last in the function parameter list.'; }, 'Validate: Variadic last function parameter.');


    }
    catch (e) {
        QUnit.pushFailure(e);
    }

});
