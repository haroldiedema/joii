'use strict';
require('../../dist/joii.min.js');

/**
 * This class is the same as the one from '1.class.js' but utilizes a
 * constructor to immediately set the value of 'some_number'.
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

var a = new MyClass(10);

// Print the current value to the screen. The expected result is 10, because
// we passed that number to the constructor.
console.log(a.getSomeNumber());

// Add a number to it.
a.add(10);

// Print it again. The new output is 20.
console.log(a.getSomeNumber());
