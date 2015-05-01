'use strict';
require('../../dist/joii.min.js');

/**
 * Demonstrate a simple use of private properties and methods.
 */
var MyClass = Class({

    'private some_property' : 'Hi there.',

    'private someMethod' : function () {
        return this.some_property;
    },

    'public anotherMethod': function () {
        return this.someMethod();
    }

});

var a = new MyClass();

// Prints "undefined".
console.log(typeof a.someMethod);
console.log(typeof a.some_property);

// Prints "Hi there."
console.log(a.anotherMethod());
