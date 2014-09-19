var testrunner = require("qunit");

testrunner.run({
    code: "./src/joii.js",
    tests: [
            "./test/class",
            "./test/accessibility",
            "./test/inheritance-basic",
            "./test/inheritance-deep",
            "./test/interface",
            "./test/plugin-compile",
            "./test/plugin-scope",
            "./test/plugin-support",
            "./test/traits"
    ]
});
