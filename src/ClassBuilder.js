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

    // Register JOII 'namespace'.
    g.JOII = typeof(g.JOII) !== 'undefined' ? g.JOII : {};
    g.JOII.ClassRegistry = {};

    /**
     * The ClassBuilder is responsible for creating a class definition based
     * on the given parameters and body. We use the PrototypeBuilder to create
     * a uniform prototype based on our own defined class body and the
     * prototypes of inherited definitions.
     *
     * The resulting function will be the class definition which creates its
     * own new 'scope' each time it's instantiated.
     *
     * @param string name
     * @param object parameters
     * @param object body
     * @return function
     */
    g.JOII.ClassBuilder = function()
    {
        var args        = g.JOII.Compat.ParseArguments(arguments),
            name        = args.name,
            parameters  = args.parameters,
            body        = args.body;

        /**
         * Defines the class definition. This is the function that is executed
         * when the class is instantiated or executed. The function will relay
         * execution to the __construct or __call method, depending whether the
         * class was called as a function or instantiated using the 'new'
         * keyword.
         *
         * @return object The outer (public) class scope.
         */
        function definition()
        {
            // Create an inner and outer scope. The inner scope refers to the
            // 'this' variable, where the outer scope contains references to
            // all objects and functions accessible from the outside.
            var func_in       = function() {};
            func_in.prototype = this;
            var scope_in      = new func_in(),
                scope_out     = {};

            // Create a deep copy of the inner scope because we need to
            // dereference object-type properties. If we don't do this, object-
            // types are treated statically throughout all instances.
            scope_in = g.JOII.Compat.extend(true, {}, scope_in);

            if (typeof this !== 'undefined') {
                g.JOII.CreateProperty(scope_in, '__joii__', (this.__joii__));
                g.JOII.CreateProperty(scope_out, '__joii__', (this.__joii__));
            }

            if (typeof this !== 'undefined' && typeof(this.__joii__) === 'object') {

                // Can we be instantiated?
                if (this.__joii__.is_abstract === true) {
                    throw 'An abstract class cannot be instantiated.';
                }

                // The outside scope.
                for (var i in this) {
                    var meta = this.__joii__.metadata[i];

                    // Test missing abstract implementations...
                    if (meta && meta.is_abstract === true) {
                        throw 'Missing abstract member implementation of "' + i + '".';
                    }
                    // Only allow public functions in the outside scope.
                    if (typeof(this[i]) === 'function' &&
                       (typeof(meta) === 'undefined' || meta.visibility === 'public') &&
                       (i !== '__call')) {
                        scope_out[i] = g.JOII.Compat.Bind(scope_in[i], scope_in);
                    }
                }
            }

            // If 'this.__joii__' is not available, that would indicate that
            // we've been executed like a function rather than being instantiated.
            if (typeof(this) === 'undefined' || typeof(this.__joii__) === 'undefined') {
                // If the method __call exists, execute it and return its result.

                for (var c in g.JOII.Config.callables) {
                    if (g.JOII.Config.callables.hasOwnProperty(c)) {
                        if (typeof(body[g.JOII.Config.callables[c]]) === 'function') {
                            var result = body[g.JOII.Config.callables[c]].apply(body, arguments);
                            if (result === body) {
                                throw g.JOII.Config.callables[c] + ' cannot return itself.';
                            }
                            return result;
                        }
                    }
                }
                throw 'This class cannot be called as a function because it\'s lacking the __call method.';
            }

            // Create a reference to the outer scope for use in fluid interfacing.
            scope_in.__api__ = scope_out;

            // Does the class defintion have a constructor? If so, run it.
            for (var c in g.JOII.Config.constructors) {
                if (g.JOII.Config.constructors.hasOwnProperty(c)) {
                    var cc = g.JOII.Config.constructors[c];
                    if (typeof(scope_in[cc]) === 'function') {
                        scope_in[cc].apply(scope_in, arguments);
                        break;
                    }
                }
            }

            // Are we attempting to instantiate an abstract class?
            if (this.__joii__.is_abstract) {
                throw 'Cannot instantiate abstract class ' + this.__joii__.name;
            }

            return scope_out;
        }

        // Apply to prototype to the instantiator to allow extending the
        // class definition upon other definitions without instantiation.
        definition.prototype = g.JOII.PrototypeBuilder(name, parameters, body, false);

        // Apply constants to the definition
        for (var i in definition.prototype.__joii__.constants) {
            g.JOII.CreateProperty(definition, i, definition.prototype.__joii__.constants[i], false);
        }

        // Does the class implement an enumerator?
        if (typeof(parameters['enum']) === 'string') {
            var e = g.JOII.EnumBuilder(parameters['enum'], definition);
            if (parameters.expose_enum === true) {
                if (typeof(g[parameters['enum']]) !== 'undefined') {
                    throw 'Cannot expose Enum "' + parameters['enum'] + '" becase it already exists in the global scope.';
                }
                g[parameters['enum']] = e;
            }
        }

        // Override toString to return a class symbol.
        var n = arguments[0];
        definition.toString = function() {
            if (typeof(n) === 'string') {
                return '[class ' + n + ']';
            }
            return '[class Class]';
        };

        // Store defined interfaces in the metadata.
        definition.prototype.__joii__.interfaces = parameters['implements'];

        // TODO performance can be increased here by storing the parsed
        //      interfaces in the 'interfaces' array in __joii__.

        // Recursive function for retrieving a list of interfaces from the
        // current class and the rest of the inheritance tree.
        definition.prototype.__joii__.getInterfaces = g.JOII.Compat.Bind(function() {
            var interfaces = [],
                getRealInterface = g.JOII.Compat.Bind(function(i) {
                if (typeof(i) === 'function') {
                    return i;
                } else if (typeof(i) === 'string') {
                    if (typeof(g.JOII.InterfaceRegistry[i]) === 'undefined') {
                        throw 'Interface "' + i + '" does not exist.';
                    }
                    return g.JOII.InterfaceRegistry[i];
                }
            }, this);

            // Fetch interfaces from the parent list - if they exist.
            if (typeof(this.parent) !== 'undefined' && typeof(this.parent.__joii__) !== 'undefined') {
                interfaces = this.parent.__joii__.getInterfaces();
            }

            if (typeof(this.interfaces) !== 'undefined') {
                if (typeof(this.interfaces) === 'object') {
                    for (var i in this.interfaces) {
                        if (!this.interfaces.hasOwnProperty(i)) {
                            continue;
                        }
                        interfaces.push(getRealInterface(this.interfaces[i]));
                    }
                } else {
                    interfaces.push(getRealInterface(this.interfaces));
                }
            }

            return interfaces;
        }, definition.prototype.__joii__);


        // If any interfaces are implemented in this class, validate them
        // immediately rather than doing so during instantiation. If the
        // class is declared abstract, the validation is skipped.
        if (parameters.abstract !== true) {
            var interfaces = definition.prototype.__joii__.getInterfaces();
            for (var ii in interfaces) {
                if (interfaces.hasOwnProperty(ii) && typeof(interfaces[ii]) === 'function') {
                    interfaces[ii](definition);
                }
            }
        }

        // Register the class by the given name to make it usable as a type
        // inside property declarations.
        if (typeof(g.JOII.ClassRegistry[name]) !== 'undefined') {
            throw 'Another class named "' + name + '" already exists.';
        }
        g.JOII.ClassRegistry[name] = definition;

        definition.prototype = g.JOII.Compat.extend(true, {}, definition.prototype);

        return definition;
    };
}(
    typeof(global) !== 'undefined' ? global : window,
    undefined
));