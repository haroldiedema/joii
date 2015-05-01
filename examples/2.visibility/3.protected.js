'use strict';
require('../../dist/joii.min.js');

/**
 * In this example, we take the class from '2.private.js' but make the private
 * property 'some_property' protected. This way, it's still not accessible from
 * the outside, but will have getter/setter methods generated for it. (see line
 * 14).
 */
var MyClass = Class({

    'protected some_property' : 'Hi there.',

    'private someMethod' : function () {
        return this.getSomeProperty();
    },

    'public anotherMethod': function () {
        return this.someMethod();
    }

});

var a = new MyClass();

// Prints "undefined".
console.log(typeof a.someMethod);
console.log(typeof a.getSomeProperty);

// Prints "Hi there."
console.log(a.anotherMethod());
