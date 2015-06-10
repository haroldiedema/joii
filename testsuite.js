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
 * TestSuite Definition
 */
var testsuite = {
    code  : "./dist/joii.js",
    tests : [
         // PrototypeBuilder
             "./test/PrototypeBuilder/DeepCopyTest.js",
             "./test/PrototypeBuilder/InheritanceTest.js",
             "./test/PrototypeBuilder/PropertyMetaTest.js",
             "./test/PrototypeBuilder/TraitTest.js",
         // ClassBuilder
             "./test/ClassBuilder/InstantiationTest.js",
             "./test/ClassBuilder/InheritanceTest.js",
             "./test/ClassBuilder/AbstractImplementationTest.js",
             "./test/ClassBuilder/VisibilityTest.js",
             "./test/ClassBuilder/GetterTest.js",
             "./test/ClassBuilder/SetterValidationTest.js",
             "./test/ClassBuilder/NullableTypeTest.js",
             "./test/ClassBuilder/TypeValidationTest.js",
             "./test/ClassBuilder/InstanceOfTest.js",
             "./test/ClassBuilder/CallTest.js",
             "./test/ClassBuilder/ConstantTest.js",
         // InterfaceBuilder,
             "./test/InterfaceBuilder/InterfaceBuilderTest.js",
             "./test/InterfaceBuilder/InterfaceValidationTest.js",
         // EnumBuilder
             "./test/EnumBuilder/EnumBuilderTest.js",
         // Reflection
             "./test/Reflection/ReflectionTest.js",
         // GitHub Reported Issues
             "./test/IssueReports/IssueReport4.js",
             "./test/IssueReports/IssueReport9.js",
             "./test/IssueReports/IssueReport10.js",
             "./test/IssueReports/IssueReport11.js"
    ]
};

/**
 * Platform-independent bootstrap.
 */
if (typeof(window) === 'undefined') {
    // Are we running on CLI / NodeJS ?
    var qunit = require("qunit");
    qunit.run(testsuite);
} else {
    // We're running a browser.
    var addScript = function(file) {
        var s = document.createElement('script');
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('src', file);
        document.getElementsByTagName('head')[0].appendChild(s);
    };
    addScript(testsuite.code);
    for (var i in testsuite.tests) {
        addScript(testsuite.tests[i]);
    }
}
