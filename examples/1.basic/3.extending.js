'use strict';
require('../../dist/joii.min.js');

/**
 * Here we take the example class from '2.constructor.js' and create a child
 * class for it which extends the functionality of this class.
 */
var MyClass = Class({

    some_number : 42,

    construct: function (number) {
        this.setSomeNumber(number);
    },

    /**
     * Adds the given number to 'some_number'.
     * @param number
     */
    add: function (number) {
        this.some_number += number;
    }
});

/**
 * This class extends on MyClass and adds a function to it that allows us to
 * subtract numbers from the value in the 'some_number' property.
 */
var AnotherClass = Class({ extends: MyClass }, {

    /**
     * Subtract the given number from 'some_number'.
     * @param number
     */
    sub: function(number) {
        this.some_number -= number;
    }

});


var a = new AnotherClass(10);

// Prints 10.
console.log(a.getSomeNumber());

// Subtract 2 and add 3.
a.sub(2);
a.add(3);

// Prints 11.
console.log(a.getSomeNumber());
