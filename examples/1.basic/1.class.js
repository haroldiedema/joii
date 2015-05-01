'use strict';
require('../../dist/joii.min.js');

/**
 * Demonstrates a simple class containing a numeric property and a method that
 * adds a value to the numeric property.
 */
var MyClass = Class({

    some_number : 42,

    /**
     * Adds the given number to 'some_number'.
     * @param number
     */
    add: function (number) {
        this.some_number += number;
    }
});

var a = new MyClass();

// Print the current value to the screen. The expected result is 42.
console.log(a.getSomeNumber());

// Add a number to it.
a.add(10);

// Print it again. The new output is 52.
console.log(a.getSomeNumber());
