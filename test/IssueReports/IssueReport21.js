/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * Interface collisions
 */
test('IssueReports:IssueReport21', function(assert) {
    var InterfaceA = JOII.InterfaceBuilder('InterfaceA', {});
    var InterfaceB = JOII.InterfaceBuilder('InterfaceB', {});

    var InterfaceAImplemented = JOII.ClassBuilder({'implements': InterfaceA}, {});

    var MyClass = JOII.ClassBuilder({
        'public nullable InterfaceA ia' : null
    });

    var success;
    try {
        var myClass = new MyClass();
        myClass.setIa(new InterfaceAImplemented());
        success = true;
    }
    catch (exception){
        console.error("exception thrown: " + exception.toString());
        success = false;
    }
    ok(success, "myClass.setIa should not thrown an exception because the object is the right one");
});
