/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
* Tests inheritance of instantiated class defintions.
*/
test('ClassBuilder:StaticTest', function(assert) {
    
    var a = JOII.ClassBuilder({}, function (a) { return { 
        'public static  number      static_num'      : 1,
        'public         number      instance_num'      : 1,
        'public static  function    test'   : function() {
            this.static_num = 2;
            this.instance_num = 3; // doesn't actually exist in the static scope
            return true;
        },
        'public         function    test'   : function() {
            this.static_num = 4; // doesn't actually exist in the instance scope
            this.instance_num = 5;
            return false;
        },
        'public         function    test2'   : function() {
            this.getStatic().static_num = 6;
            return true;
        },
        'public         function    test3'   : function() {
            a.static_num = 7;
            return true;
        }
    }}); 

    var a1 = new a();
    
    // try setting static members from within a static function
    assert.strictEqual(a.getStaticNum(), 1, "a.getStaticNum() == 1");
    assert.strictEqual(a.test(), true, "inside static function: this.static_num = 2");
    assert.strictEqual(a.getStaticNum(), 2, "a.getStaticNum() == 2");
    
    //verify initial instance member value - a.test() attempted to change it using "this" from within a static function (shouldn't have worked)
    assert.strictEqual(a1.getInstanceNum(), 1, "a1.getInstanceNum() == 1");
    

    assert.strictEqual(a1.test(), false, "a1.test() == false");
    assert.strictEqual(a1.getInstanceNum(), 5, "a1.getInstanceNum() == 5");
    assert.strictEqual(a.getStaticNum(), 2, "a.getStaticNum() == 2");
    
    assert.strictEqual(a1.test2(), true, "a1.test2() == true");
    assert.strictEqual(a.getStaticNum(), 6, "a.getStaticNum() == 6");

    assert.strictEqual(a1.test3(), true, "a1.test2() == true");
    assert.strictEqual(a.getStaticNum(), 7, "a.getStaticNum() == 7");


    
});
