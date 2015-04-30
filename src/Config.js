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

(function (g, undefined) {

    g.JOII.Config = {

        constructors : ['__construct', 'construct', '->', '=>'],
        callables    : ['__call', '<>'],

        /**
         * Adds a constructor method name. The first occurance of a function
         * named like one of these is executed. The rest is ignored to prevent
         * ambiguous behavior.
         *
         * @param {string} name
         */
        addConstructor : function (name) {
            if (g.JOII.Config.constructors.indexOf(name) !== -1) {
                return;
            }

            g.JOII.Config.constructors.push(name);
        },

        /**
         * Adds a callable method name, like __call. Only one of these is
         * executed if more than one exist to prevent ambiguous behaviour.
         *
         * @param {string} name
         */
        addCallable: function (name) {
            if (g.JOII.Config.callables.indexOf(name) !== -1) {
                return;
            }

            g.JOII.Config.callables.push(name);
        }
    };

}(
    typeof window !== 'undefined' ? window : global
));
