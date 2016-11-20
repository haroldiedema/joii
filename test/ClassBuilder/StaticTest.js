/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
* Tests inheritance of instantiated class defintions.
*/
test('ClassBuilder:StaticTest', function(assert) {
    
    var TestClass1 = JOII.ClassBuilder("TestClass1", {}, function (TestClass1) { return { 
        'private    static      number      static_private_num'   : 1,
        'protected  static      number      static_protected_num' : 1,
        'public     static      number      static_num'           : 1,
        'public                 number      instance_num'         : 1,
        'public     static      function    test'   : function() {
            TestClass1.static_num = 2;
            this.instance_num = 3; // doesn't actually exist in the static scope
            return true;
        },
        'public         function    test'   : function() {
            this.static_num = 4; // doesn't actually exist in the instance scope
            this.instance_num = 5;
            return false;
        },
        'public         function    test2'   : function() {
            TestClass1.static_num = 6;
            return true;
        },
        'public         function    test3'   : function() {
            TestClass1.static_num = 7;
            return true;
        },
        'public static  function    testGet()'   : function() {
            return TestClass1.getStaticProtectedNum();
        }

    }});

    var a1 = new TestClass1();
    
    // try setting static members from within a static function
    assert.strictEqual(TestClass1.getStaticNum(), 1, "TestClass1.getStaticNum() == 1");
    assert.strictEqual(TestClass1.test(), true, "Static function TestClass1.test() called successfully");
    assert.strictEqual(TestClass1.getStaticNum(), 2, "TestClass1.getStaticNum() == 2");
    
    //verify initial instance member value - TestClass1.test() attempted to change it using "this" from within a static function (shouldn't have worked)
    assert.strictEqual(a1.getInstanceNum(), 1, "a1.getInstanceNum() == 1");
    
    assert.strictEqual(a1.test(), false, "Instance function a1.test() called successfully");
    assert.strictEqual(a1.getInstanceNum(), 5, "a1.getInstanceNum() == 5");
    assert.strictEqual(TestClass1.getStaticNum(), 2, "TestClass1.getStaticNum() == 2");
    
    assert.strictEqual(a1.test2(), true, "a1.test2() == true");
    assert.strictEqual(TestClass1.getStaticNum(), 6, "TestClass1.getStaticNum() == 6");

    assert.strictEqual(a1.test3(), true, "a1.test2() == true");
    assert.strictEqual(TestClass1.getStaticNum(), 7, "TestClass1.getStaticNum() == 7");
    
    assert.strictEqual(TestClass1.testGet(), 1, "TestClass1.testGet() == 1");
    
    

    var TestClass2 = JOII.ClassBuilder("TestClass2", {'extends': TestClass1}, function (TestClass2) { return { 
        'public static immutable  string      static_str'      : 'test',
        'public static  function    test(string)'   : function(str) {
            TestClass2.static_str = str;
        },
        'public static  function    test(number)'   : function(num) {
            TestClass2.setStaticProtectedNum(num);
        }
    }});

    
    var a2 = new TestClass2();
    
    // try setting static members from within a static function (inherited). Should be affecting the member in TestClass1.
    assert.strictEqual(TestClass2.getStaticNum(), 7, "TestClass2.getStaticNum() == 7");
    assert.strictEqual(TestClass2.test(), true, "Static function TestClass2.test() called successfully");
    assert.strictEqual(TestClass2.getStaticNum(), 2, "TestClass2.getStaticNum() == 2");
    assert.strictEqual(TestClass1.getStaticNum(), 2, "TestClass1.getStaticNum() == 2");
    
    //verify initial instance member value - TestClass2.test() attempted to change it using "this" from within a static function (shouldn't have worked)
    assert.strictEqual(a2.getInstanceNum(), 1, "a2.getInstanceNum() == 1");
    
    assert.strictEqual(a2.test(), false, "Instance function a2.test() called successfully");
    assert.strictEqual(a2.getInstanceNum(), 5, "a2.getInstanceNum() == 5");
    assert.strictEqual(TestClass2.getStaticNum(), 2, "TestClass2.getStaticNum() == 2");
    assert.strictEqual(TestClass1.getStaticNum(), 2, "TestClass1.getStaticNum() == 2");
    
    assert.strictEqual(a2.test2(), true, "a2.test2() == true");
    assert.strictEqual(TestClass2.getStaticNum(), 6, "TestClass2.getStaticNum() == 6");
    assert.strictEqual(TestClass1.getStaticNum(), 6, "TestClass1.getStaticNum() == 6");

    assert.strictEqual(a2.test3(), true, "a2.test2() == true");
    assert.strictEqual(TestClass2.getStaticNum(), 7, "TestClass2.getStaticNum() == 7");
    assert.strictEqual(TestClass1.getStaticNum(), 7, "TestClass1.getStaticNum() == 7");
    
    TestClass2.setStaticNum(8);
    assert.strictEqual(TestClass2.getStaticNum(), 8, "TestClass2.getStaticNum() == 8");
    assert.strictEqual(TestClass1.getStaticNum(), 8, "TestClass1.getStaticNum() == 8");
    
    assert.strictEqual(TestClass2.testGet(), 1, "TestClass2.testGet() == 1");

    TestClass2.test(2);
    assert.strictEqual(TestClass1.testGet(), 2, "TestClass1.testGet() == 2");
    assert.strictEqual(TestClass2.testGet(), 2, "TestClass2.testGet() == 2");
    

    assert.throws(function() {
        TestClass2.setStaticProtectedNum(2);
    }, function(err) { return err.message === 'TestClass2.setStaticProtectedNum is not a function'; }, 'Validate: Static protected visibility.');


    assert.throws(function() {
        TestClass2.setStaticStr('new test');
    }, function(err) { return err.message === 'TestClass2.setStaticStr is not a function'; }, 'Validate: Static immutable.');

    assert.strictEqual(TestClass2.getStaticStr(), 'test', "TestClass2.getStaticStr() == 'test'");
    
    assert.throws(function() {
        TestClass1.getStaticStr();
    }, function(err) { return err.message === 'TestClass1.getStaticStr is not a function'; }, 'Validate: TestClass1.getStaticStr doesn\'t exist');


    var TestClass3 = JOII.ClassBuilder("TestClass3", {'extends': TestClass2}, function (TestClass3) { return { 
            
    }});
    

    // overloaded static method on an inherited class, changing immutable static member
    TestClass3.test('new test');
    
    assert.throws(function() {
        TestClass3.setStaticStr('newer test');
    }, function(err) { return err.message === 'TestClass3.setStaticStr is not a function'; }, 'Validate: Static immutable.');

    assert.strictEqual(TestClass3.getStaticStr(), 'new test', "TestClass3.getStaticStr() == 'new test'");
    assert.strictEqual(TestClass2.getStaticStr(), 'new test', "TestClass2.getStaticStr() == 'new test'");
    

    var a3 = new TestClass3();
    
    // try setting static members from within a static function (inherited). Should be affecting the member in TestClass1.
    assert.strictEqual(TestClass3.getStaticNum(), 8, "TestClass3.getStaticNum() == 8");
    assert.strictEqual(TestClass3.test(), true, "Static function TestClass3.test() called successfully");
    assert.strictEqual(TestClass3.getStaticNum(), 2, "TestClass3.getStaticNum() == 2");
    assert.strictEqual(TestClass1.getStaticNum(), 2, "TestClass1.getStaticNum() == 2");
    
    //verify initial instance member value - TestClass3.test() attempted to change it using "this" from within a static function (shouldn't have worked)
    assert.strictEqual(a3.getInstanceNum(), 1, "a3.getInstanceNum() == 1");
    
    assert.strictEqual(a3.test(), false, "Instance function a3.test() called successfully");
    assert.strictEqual(a3.getInstanceNum(), 5, "a3.getInstanceNum() == 5");
    assert.strictEqual(TestClass3.getStaticNum(), 2, "TestClass3.getStaticNum() == 2");
    assert.strictEqual(TestClass1.getStaticNum(), 2, "TestClass1.getStaticNum() == 2");
    
    assert.strictEqual(a3.test2(), true, "a3.test2() == true");
    assert.strictEqual(TestClass3.getStaticNum(), 6, "TestClass3.getStaticNum() == 6");
    assert.strictEqual(TestClass1.getStaticNum(), 6, "TestClass1.getStaticNum() == 6");

    assert.strictEqual(a3.test3(), true, "a3.test2() == true");
    assert.strictEqual(TestClass3.getStaticNum(), 7, "TestClass3.getStaticNum() == 7");
    assert.strictEqual(TestClass1.getStaticNum(), 7, "TestClass1.getStaticNum() == 7");
    


        
    var TestStaticInterface = JOII.InterfaceBuilder('TestStaticInterface', {
        'public nullable string name' : null,
        'protected static number age' : null,
        'public static function myTest(string)' : function(a) {}
    });

    
    
    assert.throws(function() {
        var InterfaceTestClass = JOII.ClassBuilder("InterfaceTestClass", {'implements': TestStaticInterface}, function (InterfaceTestClass) { return { 
            'public static nullable string name' : null,
            'protected static number age' : null,
            'public static function myTest(string)' : function(a) {}
        }});
    }, function(err) { return err === 'Class must implement public nullable string "name" as defined in the interface TestStaticInterface.'; }, 'Validate: Implementation must match non-static descriptor.');

    
    assert.throws(function() {
        var InterfaceTestClass = JOII.ClassBuilder("InterfaceTestClass", {'implements': TestStaticInterface}, function (InterfaceTestClass) { return { 
            'public nullable string name' : null,
            'protected number age' : null,
            'public static function myTest(string)' : function(a) {}
        }});
    }, function(err) { return err === 'Class must implement protected static number "age" as defined in the interface TestStaticInterface.'; }, 'Validate: Property implementation must match static descriptor.');
    
    assert.throws(function() {
        var InterfaceTestClass = JOII.ClassBuilder("InterfaceTestClass", {'implements': TestStaticInterface}, function (InterfaceTestClass) { return { 
            'public nullable string name' : null,
            'protected static number age' : null,
            'public function myTest(string)' : function(a) {}
        }});
    }, function(err) { return err === 'Class must implement public static function "myTest" as defined in the interface TestStaticInterface.'; }, 'Validate: Method implementation must match static descriptor.');
    
    assert.throws(function() {
        var InterfaceTestClass = JOII.ClassBuilder("InterfaceTestClass", {'implements': TestStaticInterface}, function (InterfaceTestClass) { return { 
            'public nullable string name' : null,
            'protected static number age' : null,
            'public static function myTest(number)' : function(a) {}
        }});
    }, function(err) { return err === 'Method myTest does not match the parameter types as defined in the interface TestStaticInterface.'; }, 'Validate: Method implementation must match static descriptor and parameter types.');
    
    // shouldn't throw anything
    var InterfaceTestClass = JOII.ClassBuilder("InterfaceTestClass", {'implements': TestStaticInterface}, function (InterfaceTestClass) { return { 
        'public nullable string name' : null,
        'protected static number age' : null,
        'public static function myTest(string)' : function(a) {}
    }});


    
    assert.throws(function() {
        var StaticTestClass = JOII.ClassBuilder("StaticTestClass", {'static': true}, function (StaticTestClass) { return { 
            'public string name' : null
        }});
    }, function(err) { return err === "Member name is non-static. A static class cannot contain non-static members."; }, 'Validate: Static class must contain only static members.');
    
    
    var StaticTestClass = JOII.ClassBuilder("StaticTestClass", {'static': true}, function (StaticTestClass) { return { 
        'public static string person' : 'bob'
    }});
    
    assert.throws(function() {
        var newTest = new StaticTestClass();
    }, function(err) { return err === "A static class cannot be instantiated."; }, 'Validate: Static classes cannot be instantiated.');
    
    assert.strictEqual(StaticTestClass.getPerson(), 'bob', "StaticTestClass.getPerson() == 'bob'");
    StaticTestClass.setPerson('joe')
    assert.strictEqual(StaticTestClass.getPerson(), 'joe', "StaticTestClass.getPerson() == 'joe'");

    
    var TestClass4 = JOII.ClassBuilder("TestClass4", {}, function (TestClass4) { return { 
        'public     static      TestClass4  instance'   : null,
        'protected              number      num'        : 1,
        'public     static      function    construct'  : function() {
            TestClass4.instance = new TestClass4();
        },
        'public     static      function    test()'       : function() {
            return false;
        },
        'public                 function    test()'       : function() {
            return true;
        },
        '__call(string)'       : function(str) {
            return "Success: " + str;
        },
        '__call(number)'       : function(num) {
            return num * 2;
        },
        'public     static      function    test(number)'       : function(num) {
            return TestClass4(num);
        },
        'public     static      function    test(string)'       : function(str) {
            return TestClass4(str);
        }
    }});
    
    assert.strictEqual(TestClass4.getInstance().test(), true, "TestClass4.getInstance().test() == true");
    
    assert.throws(function() {
        TestClass4.getInstance().getNum();
    }, function(err) { return err.message === "TestClass4.getInstance(...).getNum is not a function"; }, 'Validate: In class self instantiate returned outer scope.');
    
    assert.strictEqual(TestClass4.getInstance().test(), true, "TestClass4.getInstance().test() == true");
    
    assert.strictEqual(TestClass4.test("testing"), "Success: testing", "Testing in-class _call");
    assert.strictEqual(TestClass4.test(4), 8, "Testing in-class _call overload");
    
    
});
