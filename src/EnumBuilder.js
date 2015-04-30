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
'use strict';

(function(g, undefined) {

    g.JOII.EnumRegistry = {};

    /**
     * An enumerator can be used for type checking to validate if the given
     * value exists within the object as a constant value.
     */
    g.JOII.EnumBuilder = g.JOII.ClassBuilder({ 'final': true }, {

        'public immutable string name'      : null,
        'public immutable object constants' : {},

        /**
         * @param string name
         * @param object obj
         */
        __construct: function(name, obj)
        {
            this.name      = name;
            this.constants = obj;
        },

        /**
         * Returns true if a constant with the given value exists within this
         * enumerator.
         *
         * @param  mixed value
         * @return bool
         */
        contains: function(value)
        {
            for (var i in this.constants) {
                if (this.constants[i] === value) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Registers a new Enumerator type with the given name and object.
         *
         * @param  string name
         * @param  object obj
         * @return g.JOII.EnumBuilder
         */
        __call: function(name, obj) {
            if (typeof(name) !== 'string') {
                throw 'Argument #1 of Enum must be a string, ' + typeof(name) + ' given.';
            }
            if (typeof(obj) === 'function' &&
                typeof(obj.prototype.__joii__) !== 'undefined') {
                obj = obj.prototype.__joii__.constants;
            }

            if (typeof(obj) !== 'object') {
                throw 'Argument #2 of Enum must be an object or definition, ' + typeof(obj) + ' given.';
            }

            if (typeof(g.JOII.EnumRegistry[name.toLowerCase()]) !== 'undefined') {
                throw 'Enumerator "' + name + '" already exists.';
            }

            var enumerator = new g.JOII.EnumBuilder(name, obj);
            for (var i in obj) {
                if (typeof(obj[i]) === 'function') {
                    throw 'An enumerator cannot contain functions. "' + i + '" is a function.';
                }
                if (typeof(obj[i]) === 'object') {
                    throw 'An enumerator cannot contain objects. "' + i + '" is an object.';
                }
                g.JOII.CreateProperty(enumerator, i, obj[i], false);
            }
            g.JOII.EnumRegistry[name.toLowerCase()] = enumerator;
            return enumerator;
        }
    });
}(
    typeof(global) !== 'undefined' ? global : window,
    undefined
));