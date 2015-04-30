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

    /**
     * Returns true if the given value is an instance of a JOII class.
     *
     * @param  mixed c
     * @return bool
     */
    g.JOII.isInstance = function(c) {
        return typeof(c) === 'object' && typeof(c.__joii__) === 'object' && typeof(c.instanceOf) === 'function';
    };

    g.JOII.Publish = g.JOII.Compat.Bind(function(namespace) {

        // Create the namespace object in which the API will be available.
        namespace = this.parseNamespace(namespace, g);

        namespace.Class     = g.JOII.ClassBuilder;
        namespace.Interface = g.JOII.InterfaceBuilder;
        namespace.Enum      = g.JOII.EnumBuilder;

        return namespace;
    }, {
        // ----------------------------------------------- Private Scope --- //

        /**
         * Parses the given namespace either as an object or string.
         *
         * @param undefined|string|object ns
         * @param object root
         * @return object
         */
        parseNamespace: function(ns, root)
        {
            var i, len, obj, parts, cur = [];

            // If no namespace is specified, return the root (window or global)
            if (typeof(ns) === 'undefined') {
                return root;
            }

            // If the given namespace is an object or function, return it.
            if (typeof(ns) === 'object' || typeof(ns) === 'function') {
                return ns;
            }

            // If we're dealing with a string, transform it to an object.
            if (typeof(ns) === 'string') {
                parts = ns.split(".");
                for (i = 0, len = parts.length, obj = root; i < len; ++i) {
                    cur.push(parts[i]);
                    if (typeof(obj[parts[i]]) === 'undefined') {
                        obj[parts[i]] = {};
                        obj = obj[parts[i]];
                    } else if (typeof(obj[parts[i]]) === 'object' || typeof(obj[parts[i]]) === 'function') {
                        obj = obj[parts[i]];
                    } else {
                        throw 'Unable to create namespace: ' + cur.join('.') + ' already exists as ' + typeof(obj[parts[i]]) + '.';
                    }
                }
                return obj;
            }
            throw 'parseNamespace expects undefined, object or string. ' + typeof(ns) + ' given.';
        }
    })();
}(
    typeof(global) !== 'undefined' ? global : window,
    undefined
));