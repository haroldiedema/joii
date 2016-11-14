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
        'public static  number      static_num'      : 1,
        'public         number      instance_num'      : 1,
        'public static  function    test'   : function() {
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
    
    
    

    var TestClass2 = JOII.ClassBuilder("TestClass2", {'extends': TestClass1}, function (TestClass2) { return { 
        'public static  string      static_str'      : 'test'
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
    

    var TestClass3 = JOII.ClassBuilder("TestClass3", {'extends': TestClass2}, function (TestClass3) { return { 

    }});
    
    
    var a3 = new TestClass3();
    
    // try setting static members from within a static function (inherited). Should be affecting the member in TestClass1.
    assert.strictEqual(TestClass3.getStaticNum(), 7, "TestClass3.getStaticNum() == 7");
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
    
});
