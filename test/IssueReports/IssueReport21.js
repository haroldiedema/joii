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
        var interfaceAObject = myClass.getIa();
        assert.strictEqual(interfaceAObject.instanceOf(InterfaceA), true, 'interfaceAObject is an instance of InterfaceA');
        success = true;
    }
    catch (exception){
        console.error("exception thrown: " + exception.toString());
        success = false;
    }
    ok(success, "myClass.setIa should not thrown an exception because the object is the right one");
});
