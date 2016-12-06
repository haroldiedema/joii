/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/

/**
 * TestSuite Definition
 */
var testsuite = {
    code: "./dist/joii.js",
    tests: [
        // PrototypeBuilder
        "./test/PrototypeBuilder/DeepCopyTest.js",
        "./test/PrototypeBuilder/InheritanceTest.js",
        "./test/PrototypeBuilder/PropertyMetaTest.js",
        "./test/PrototypeBuilder/TraitTest.js",
        // ClassBuilder
        "./test/ClassBuilder/StaticTest.js",
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
        "./test/IssueReports/IssueReport25.js",
        "./test/IssueReports/IssueReport29.js"
    ]
};

/**
 * Platform-independent bootstrap.
 */
if (typeof (window) === 'undefined') {
    // Are we running on CLI / NodeJS ?
    var qunit = require("qunit");
    qunit.run(testsuite);
} else {
    // We're running a browser.

    // change to src version
    testsuite.code = [
        'src/Config.js',
        'src/Compatibility.js',
        'src/PrototypeBuilder.js',
        'src/ClassBuilder.js',
        'src/InterfaceBuilder.js',
        'src/EnumBuilder.js',
        'src/Reflection.js',
        'src/joii.js',
        "https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.2/require.min.js" // need requireJS for one of the issue reports
    ];


    // ensure that all scripts load in the right order, so that the tests have the same ordinal each time
    var loaded_scripts = 0;
    var total_scripts = testsuite.tests.length;

    var all_scripts_to_load = [];

    var array_index = 0;

    if (typeof (testsuite.code) === 'object') {
        total_scripts += testsuite.code.length;
        all_scripts_to_load = testsuite.code.slice(0);
    } else {
        total_scripts++;
        all_scripts_to_load.push(testsuite.code);
    }

    Array.prototype.push.apply(all_scripts_to_load, testsuite.tests);


    var loadNextScript = function(file) {
        if (array_index < all_scripts_to_load.length) {
            addScript(all_scripts_to_load[array_index]);
            array_index++;
        }
    };

    var addScript = function(file) {
        var s = document.createElement('script');
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('src', file);
        s.onload = function() {
            loaded_scripts++;
            loadNextScript();
        };
        document.getElementsByTagName('head')[0].appendChild(s);
    };

    var require = function() {
        return window;
    };

    loadNextScript();
}
