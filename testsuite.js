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
    code:
        // For browser testing, you can either test the compiled version, or the source version, by toggling which is commented out
        // In Node.js, only the compiled version works, so be sure to switch to that before testing there
        /**/
        "./dist/joii.js",
        /** /
        [
            'src/Compatibility.js',
            'src/PrototypeBuilder.js',
            'src/ClassBuilder.js',
            'src/InterfaceBuilder.js',
            'src/EnumBuilder.js',
            'src/Reflection.js',
            'src/Config.js',
            'src/joii.js'
        ],
    /**/
    tests: [
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
        "./test/ClassBuilder/SerializeTest.js",
        "./test/ClassBuilder/FunctionOverloadingTests.js",
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
        "./test/IssueReports/IssueReport11.js",
        "./test/IssueReports/IssueReport15.js",
        "./test/IssueReports/IssueReport16.js",
        "./test/IssueReports/IssueReport19.js",
        "./test/IssueReports/IssueReport21.js",
        "./test/IssueReports/IssueReport25.js"
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
    // ensure that all scripts load in the right order, so that the tests have the same ordinal each time
    var loadedScripts = 0;
    var totalScripts = testsuite.tests.length;

    var allScriptsToLoad = [];

    var arrayIndex = 0;

    if (typeof(testsuite.code) === 'object') {
        totalScripts += testsuite.code.length;
        allScriptsToLoad = testsuite.code.slice(0);
    }
    else {
        totalScripts++;
        allScriptsToLoad.push(testsuite.code);
    }

    Array.prototype.push.apply(allScriptsToLoad, testsuite.tests);


    var LoadNextScript = function(file) {
        if (arrayIndex < allScriptsToLoad.length) {
            addScript(allScriptsToLoad[arrayIndex]);
            arrayIndex++;
        }
    };

    var addScript = function(file) {
        var s = document.createElement('script');
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('src', file);
        s.onload = function() {
            loadedScripts++;
            LoadNextScript();
        };
        document.getElementsByTagName('head')[0].appendChild(s);
    };

    function require() {
        return window;
    }

    LoadNextScript();
}
