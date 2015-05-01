'use strict';
require('../../dist/joii.min.js');

/**
 * JOII supports 3 ways of declaring visibility on a property of method: public
 * protected and private.
 *
 *  public   : The method is accessible from outside the scope of the class
 *             once instantiated. Properties that are not functions are never
 *             accessible but will have public getters and setters generated
 *             for them.
 *
 * protected : Same as public, but the getters and setters are only accessible
 *             from within the scope of the class or any inheriting classes.
 *
 * private   : Not accessible from the outside. Properties declared private
 *             will NOT have getter/setter methods generated. Please note that
 *             unlike other OOP-like languages, private methods and properties
 *             ARE accessible in inherited classes.
 */
var MyClass = Class({

    // When no meta-data is used when declaring a property, it defaults to
    // 'public' visibility with no type-checking. The following methods are
    // being generated automatically: getSomeProperty() and setSomeProperty().
    some_property: 'Hello World',

    // This does exactly the same:
    'public some_property': 'Hello World',

    // The same goes for methods:
    someMethod: function () {
        // ... do stuff.
    },

    // Is the same as:
    'public someMethod' : function () {
        // ... do stuff.
    }
});
