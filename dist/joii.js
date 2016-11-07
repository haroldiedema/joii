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

/**
 * The following code is required to provide full support for legacy browsers.
 * It's unfortionate, but mandatory for anything IE8 and below...
 *
 * We don't want to mess a lot with prototypes of native JavaScript objects
 * because that can disturb functionality of other third-party frameworks.
 */
(function(g, undefined) {

    // Register JOII 'namespace'.
    g.JOII = typeof(g.JOII) !== 'undefined' ? g.JOII : {};
    g.JOII.Compat = {};

    /**
     * Finds the name of a JOII-generated object.
     *
     * @param  object|function e
     * @return string|false
     */
    g.JOII.Compat.findJOIIName = function(e)
    {
        var i, r;
        
        if (typeof(e) === 'string' ||
            typeof(e) === 'number' ||
            typeof(e) === 'undefined' ||
            e === null
        ) {
            return false;
        }

        if (typeof(e.__joii__) !== 'undefined') {
            return e.__joii__.name;
        }
        if (typeof(e.prototype) !== 'undefined' && typeof(e.prototype.__joii__) !== 'undefined') {
            return e.prototype.__joii__.name;
        }

        // Chrome / FF // IE 11+
        if (typeof(e.__proto__) !== 'undefined') {
            r = g.JOII.Compat.findJOIIName(e.__proto__);
            if (typeof(r) === 'string') {
                return r;
            }
        }

        if (typeof(e) === 'function') {
            e = e.prototype;
        }

        for (i in e) {
            if (typeof(e[i]) === 'function' || typeof(e[i]) === 'object') {
                r = g.JOII.Compat.findJOIIName(e[i]);
                if (typeof(r) === 'string') {
                    return r;
                }
            }
        }

        return false;
    };

    /**
     * Array.indexOf implementation.
     *
     * @param  array   array
     * @param  element elt
     * @return number
     */
    g.JOII.Compat.indexOf = function(array, elt) {

        if (typeof(array.indexOf) === 'function') {
            return array.indexOf(elt);
        }

        var len  = array.length >>> 0,
            from = Number(arguments[1]) || 0;

        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        from = (from < 0) ? from + len : from;

        for (; from < len; from++) {
            if (from in array && array[from] === elt) {
                return from;
            }
        }

        return -1;
    };

    /**
     * Make a deep copy of an object.
     *
     * - original by jQuery (http://jquery.com/)
     */
    g.JOII.Compat.extend = function()
    {
        var options, src, copy, copyIsArray = false, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        if (typeof target === "boolean") {
            deep = target; target = arguments[ i ] || {}; i++;
        }
        if (typeof target !== "object" && typeof(target) !== "function") {
            target = {};
        }
        for (;i < length; i++) {
            if ((options = arguments[i]) !== null && arguments[i] !== undefined) {

                if (typeof(options.__joii__) !== 'undefined') {
                    g.JOII.CreateProperty(target, '__joii__', options.__joii__);
                }

                for (var name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) { continue; }
                    if (deep && copy && (g.JOII.Compat.isPlainObject(copy) || (copyIsArray = g.JOII.Compat.isArray(copy)) ) ) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && g.JOII.Compat.isArray(src) ? src : [];
                        } else {
                            clone = src && g.JOII.Compat.isPlainObject(src) ? src : {};
                        }
                        target[name] = g.JOII.Compat.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    };

    /**
     * Returns true if the given object is an array.
     *
     * @param  object obj
     * @return bool
     */
    g.JOII.Compat.isArray = function(obj)
    {
        var length = obj.length,
            type = typeof(obj);

        if (type === "function" || (typeof(window) !== 'undefined' && obj === window)) {
            return false;
        }
        if (obj.nodeType === 1 && length) {
            return true;
        }
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    /**
     * Returns true if the given object is a plain object (not an array).
     *
     * @param  object obj
     * @return bool
     */
    g.JOII.Compat.isPlainObject = function(obj) {
        var hasOwn = ({}).hasOwnProperty;
        if (typeof(obj) !== "object" || obj.nodeType || (typeof(window) !== 'undefined' && obj === window)) {
            return false;
        }
        if (obj.constructor && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
            return false;
        }
        return true;
    };

    /**
     * g.JOII.Compat.CreateObject implementation
     *
     * @param  object o
     * @return object
     */
    g.JOII.Compat.CreateObject = function(o) {

        if (typeof(Object.create) === 'function') {
            return Object.create(o);
        }

        var c = (function(o) {
            function Class(){}
            return function(o){
                if (arguments.length != 1) {
                    throw new Error('g.JOII.Compat.CreateObject implementation only accepts one parameter.');
                }
                Class.prototype = o;
                return new Class();
            };
        })();

        return c(o);
    };

    /**
     * Function.bind implementation. "bind" is part of ECMA-262, 5th edition
     * and therefore not available in all browsers. This polyfill is needed
     * to emulate the functionality of Function.bind
     *
     * @param  function fn
     * @param  object   context
     * @return function
     */
    g.JOII.Compat.Bind = function(fn, context) {
        if (typeof fn !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - argument #1 must be a function.");
        }

        // return fn.bind(context);

        return function bound() {
            return fn.apply(context, arguments);
        };
    };

    /**
     * http://www.ietf.org/rfc/rfc4122.txt
     *
     * @return string
     */
    g.JOII.Compat.GenerateUUID = function() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    };

    /**
     * Returns an object consisting of name, parameters and body depending on
     * the amount of parameters given.
     *
     * If no name is specified (argument[0] === string), a generated UUID will
     * take its place.
     *
     * @param  string name
     * @param  object parameters
     * @param  object body
     * @return object
     */
    g.JOII.Compat.ParseArguments = function(args) {
        var result = {name: '', parameters: {}, body: {}};

        switch(args.length) {
            // Zero-arguments. Unlikely, but valid for classes and interfaces.
            case 0:
                result.name = g.JOII.Compat.GenerateUUID();
                break;
            // One argument. Name or body.
            case 1:
                if (typeof(args[0]) === 'string') {
                    result.name = args[0];
                }
                if (typeof(args[0]) === 'object') {
                    result.name = g.JOII.Compat.GenerateUUID();
                    result.body = args[0];
                }
                break;
            // Two arguments: Name & Body or Parameters & Body
            case 2:
                if (typeof(args[0]) === 'string') {
                    result.name = args[0];
                }
                if (typeof(args[0]) === 'object') {
                    result.name = g.JOII.Compat.GenerateUUID();
                    result.parameters = args[0];
                }
                result.body = args[1];
                break;
            // Three parameters: pass them all.
            case 3:
                result.name       = args[0];
                result.parameters = args[1];
                result.body       = args[2];
        }

        // Validate the results.
        if (typeof(result.name) !== 'string' ||
            typeof(result.parameters) !== 'object' ||
            typeof(result.body) !== 'object') {
            throw 'Invalid parameter types given. Expected: ([[[string], object], <object>]).';
        }

        return result;
    };

    /**
     * Some parameters can be passed as a string, object or array of both. This
     * function will parse the argument and return an array of actual objects.
     *
     * @param  mixed arg
     * @return object[]
     */
    g.JOII.Compat.flexibleArgumentToArray = function(arg, deep)
    {
        if (typeof(arg) === 'object' && !g.JOII.Compat.isArray(arg) && typeof(arg[0]) === 'undefined') {
            return [deep ? g.JOII.Compat.extend(true, {}, arg) : arg];
        } else if (typeof(arg) === 'function') {
            return [deep ? g.JOII.Compat.extend(true, {}, arg.prototype) : arg.prototype];
        } else if (typeof(arg) === 'object' && g.JOII.Compat.isArray(arg)) {
            var result = [];
            for (var i in arg) {
                result.push(g.JOII.Compat.flexibleArgumentToArray(arg[i])[0]);
            }
            return result;
        } else {
            throw 'Unable to read ' + typeof(arg) + '. Object, function or array expected.';
        }
    };
}(
    typeof(global) !== 'undefined' ? global : window,
    undefined
));
;/*
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

    g.JOII.InternalPropertyNames = ['__joii__', 'super', 'instanceOf', 'deserialize', 'serialize'];
    g.JOII.InternalTypeNames     = [
        'undefined', 'object', 'boolean',
        'number'   , 'string', 'symbol',
        'function' , 'const'
    ];

    /**
     * The PrototypeBuilder is responsible for creating a prototype of the
     * final 'class'- or 'interface'-type.
     *
     * Parameters can consist of one or more of the following:
     *      'extends'    : <class-type> Inherit a parent type
     *      'implements' : <array of interface-type>
     *
     * @param  string name
     * @param  object parameters
     * @param  object body
     * @return function
     */
    g.JOII.PrototypeBuilder = function (name, parameters, body, is_interface) {

        // Create a clean prototype of the class body.
        var prototype = {},
            deep_copy = g.JOII.Compat.extend(true, {}, body);

        // Create the internal JOII-object.
        g.JOII.CreateProperty(prototype, '__joii__', {
            name            : name,
            parent          : undefined,
            metadata        : {},
            constants       : {},
            implementations : [name],
            is_abstract     : parameters.abstract === true ? true : false,
            is_final        : parameters.final    === true ? true : false
        });

        // Apply traits / mix-ins
        if (typeof(parameters.uses) !== 'undefined') {
            var traits = g.JOII.Compat.flexibleArgumentToArray(parameters.uses);
            for (var t in traits) {
                deep_copy = g.JOII.Compat.extend(true, deep_copy, traits[t]);
            }
        }

        if (prototype.__joii__.is_abstract && prototype.__joii__.is_final) {
            throw 'A class cannot be both abstract and final simultaniously.';
        }

        // Iterate over properties from the deep_copy, get the metadata of the
        // property and move them in the prototype.
        for (var i in deep_copy) {
            var meta = g.JOII.ParseClassProperty(i);

            if (meta.is_constant) {
                prototype.__joii__.constants[meta.name] = deep_copy[i];
                g.JOII.CreateProperty(prototype, meta.name, deep_copy[i], false);
            } else {
                prototype[meta.name] = deep_copy[i];
            }
            prototype.__joii__.metadata[meta.name] = meta;

            // Don't create getters and setters if we are an interface.
            if (is_interface === true) {
                continue;
            }
        }

        if (typeof(parameters.abstract) !== 'undefined') {
            prototype.__joii__.is_abstract = true;
            if (is_interface) {
                throw 'An interface cannot be declared abstract.';
            }
        }

        // Apply the parent prototype.
        if (typeof(parameters['extends']) !== 'undefined') {
            var parent = parameters['extends'];

            // If the given parent is a function, use its prototype.
            if (typeof(parent) === 'function') {
                parent = parent.prototype;
            }

            // Only Object-types can be used as a parent object.
            if (typeof(parent) !== 'object') {
                throw (is_interface ? 'An interface' : 'A class') + ' may only extend on functions or object-types.';
            }

            // Create a parent property in the prototype which contains a deep-
            // copy of the prototype of the given parent.
            prototype.__joii__.parent = g.JOII.Compat.extend(true, {}, parent);

            // If the parent is final, it cannot be extended upon.
            if (parent.__joii__.is_final === true) {
                throw 'Unable to extend on a final class.';
            }

            // Iterate over parent classes and apply the implementations for the instanceOf verifications.
            var current = prototype.__joii__.parent;
            while (typeof current !== 'undefined') {
                prototype.__joii__.implementations.push(current.__joii__.name);
                // Move to the next underlying class.
                current = current.__joii__.parent;
            }

            // Clone the constants of the parent into this one.
            prototype.__joii__.constants = g.JOII.Compat.extend(true, prototype.__joii__.constants, parent.__joii__.constants);

            // The __joii__ property is usually hidden and not enumerable, so we
            // need to re-create it ourselves.
            g.JOII.CreateProperty(prototype.__joii__.parent, '__joii__', (parent.__joii__));

            // Iterate over the properties of the parent object and apply the
            // contents in our own prototype where applicable.
            for (i in prototype.__joii__.parent) {
                // We're only interested in properties that really belong to
                // the object. So we'll skip any inherited things from the
                // native JavaScript's "Object".
                if (!prototype.__joii__.parent.hasOwnProperty(i)) {
                    continue;
                }

                // If the property is an internal method, skip it.
                if (g.JOII.Compat.indexOf(g.JOII.InternalPropertyNames, i) !== -1) {
                    continue;
                }

                var property      = prototype.__joii__.parent[i];
                var property_meta = prototype.__joii__.parent.__joii__.metadata[i];
                var proto_meta    = prototype.__joii__.metadata[i];

                if (typeof(proto_meta) === 'undefined') {
                    proto_meta = prototype.__joii__.metadata[i] = property_meta;
                }

                // If another property with the same name already exists within
                // our own prototype, skip its inherited implementation.
                if (typeof(prototype[i]) !== 'undefined' &&
                    typeof(property_meta) === 'object' &&
                    typeof(proto_meta) === 'object') {

                    if (proto_meta.is_generated === false) {
                        // Check for visibility change.
                        if (property_meta.visibility !== proto_meta.visibility) {
                            throw 'Member "' + i + '" must be ' + property_meta.visibility + ' as defined in the parent ' + (is_interface ? 'interface' : 'class') + '.';
                        }

                        // Check final properties.
                        if (property_meta.is_final === true) {
                            throw 'Final member "' + i + '" cannot be overwritten.';
                        }

                        // Is the property read-only?
                        if (property_meta.is_read_only !== proto_meta.is_read_only) {
                            throw 'Member "' + i + '" must be read-only as defined in the parent ' + (is_interface ? 'interface' : 'class') + '.';
                        }

                        // Is the property nullable?
                        if (property_meta.is_nullable !== proto_meta.is_nullable) {
                            throw 'Member "' + i + '" must be nullable as defined in the parent ' + (is_interface ? 'interface' : 'class') + '.';
                        }
                    }
                    continue;
                }

                // It's safe to apply non-function properties immediatly.
                if (typeof(property) !== 'function' || is_interface === true) {
                    prototype[i] = property;

                    // Create getters and setters for properties defined in a parent class,
                    // but only if they aren't declared in the child. (Fixes issue #10)
                    var gs = g.JOII.CreatePropertyGetterSetter(prototype, property_meta);
                    if (typeof prototype[gs.getter.name] === 'undefined' && typeof gs.getter.meta !== 'undefined') {
                        gs.getter.meta.is_generated = true;
                        prototype[gs.getter.name] = gs.getter.fn;
                        prototype.__joii__.metadata[gs.getter.name] = gs.getter.meta;
                    }
                    if (typeof prototype[gs.setter.name] === 'undefined' && typeof gs.setter.meta !== 'undefined') {
                        gs.setter.meta.is_generated = true;
                        prototype[gs.setter.name] = gs.setter.fn;
                        prototype.__joii__.metadata[gs.setter.name] = gs.setter.meta;
                    }
                    continue;
                }

                // From this point on, the 'property' variable only contains
                // functions. This is where the funny business starts. Instead
                // of simply copying the 'function' into our own prototype,
                // we'll create our own function which calls the function from
                // the parent object. (Fixes issue #9)
                // The function "super" is implemented from the ClassBuilder.
                prototype[i] = Function('\
                    var args = ["'+i+'"];\
                    for (var i in arguments) { args.push(arguments[i]); }\
                    return this[\'super\'].apply(this, args);\
                ');
            }
        }

        // Create getters and setters for properties. We do this _after_ the
        // copying of the parent object because that prototype doesn't contain
        // the getter/setter methods yet. (Fixes issue #10)
        for (var i in deep_copy) {
            var meta = g.JOII.ParseClassProperty(i);
            // Generate getters and setters if we're not dealing with anything
            // that is a function or declared private.
            if (typeof(prototype[meta.name]) !== 'function' &&
                meta.visibility !== 'private') {

                var gs = g.JOII.CreatePropertyGetterSetter(deep_copy, meta);
                prototype[gs.getter.name] = gs.getter.fn;
                prototype.__joii__.metadata[gs.getter.name] = gs.getter.meta;
                prototype[gs.setter.name] = gs.setter.fn;
                prototype.__joii__.metadata[gs.setter.name] = gs.setter.meta;
            }
        }



        if (is_interface !== true) {
            /**
             * Calls a method from the parent prototype (if it exists).
             *
             * @param string method
             * @param ...
             * @return mixed
             */
            prototype['super'] = function(method) {
                var args          = Array.prototype.slice.call(arguments, 1),
                    current_scope = this,
                    original_prop = this.__joii__,
                    call          = function(scope, method, args) {
                    if (typeof(scope) === 'undefined') {
                        throw new Error('Parent method "' + method + '" does not exist.');
                    }
                    if (typeof(scope.__joii__.parent) !== 'undefined' &&
                        typeof(scope.__joii__.parent[method]) === 'undefined') {
                        return call(scope.__joii__.parent, method, args);
                    }

                    var parent = scope.__joii__.parent;
                    if (typeof(scope.__joii__.parent) === 'undefined') {
                        if(typeof(scope.__api__.__joii__.parent) !== 'undefined') {
                            parent = scope.__api__.__joii__.parent;
                        } else {
                            throw new Error('Method "' + method + '" does not exist in the parent class. (called using \'super()\')');
                        }
                    }

                    var m = parent[method];
                    current_scope.__joii__ = parent.__joii__;
                    var r = m.apply(current_scope, args);
                    current_scope.__joii__ = original_prop;
                    return r;
                };

                return call(this, method, args);
            };

            /**
             * Tests if the prototype implements an interface of the given name.
             *
             * @param string name
             * @return bool
             */
            prototype.instanceOf = function(name) {

                // Find the JOII scope of the given object.
                if (typeof(name) === 'function') {
                    name = name.prototype.__joii__.name;
                } else if (typeof(name) === 'object') {
                    name = name.__joii__.name;
                }

                // Match against defined interfaces implemented in the class.
                var interfaces = this.__joii__.getInterfaces();
                for (var i in interfaces) {
                    if (interfaces.hasOwnProperty(i) && interfaces[i].prototype.__joii__.name === name) {
                        return true;
                    }
                    if (JOII.Compat.indexOf(interfaces[i].prototype.__joii__.implementations, name) !== -1) {
                        return true;
                    }
                }
                if (this.__joii__.name !== name) {
                    // Attempt to validate by parent.
                    if (typeof(this.__joii__.parent) !== 'undefined') {
                        // Temporarily bind instanceOf to the parent scope.
                        var cur_scope = this;
                        var par_scope = this.__joii__.parent;
                        g.JOII.Compat.Bind(par_scope.instanceOf, par_scope);
                        var result = par_scope.instanceOf(name);
                        // Restore the scope and return the result.
                        g.JOII.Compat.Bind(par_scope.instanceOf, cur_scope);
                        return result;
                    }
                    return false;
                }
                return true;
            };


        }

        return prototype;
    };

    /**
     * Parses a class property name and returns an object of property
     * metadata such as 'final', 'abstract', 'protected', etc.
     *
     * @param  string str
     * @return object
     */
    g.JOII.ParseClassProperty = function(str) {
        // Parse the given string and set some defaults.
        var data     = str.toString().replace(/^\s+|\s+(?=\s)|\s+$/g,'').split(/\s/),
            name     = data[data.length - 1],
            types    = g.JOII.InternalTypeNames,
            explicit_serialize = false,
            metadata = {
                'name'         : name,
                'type'         : null,      // Allow all types by default.
                'visibility'   : 'public',  // Can be one of: public, protected, private.
                'is_abstract'  : false,     // Force implementation in child.
                'is_final'     : false,     // Disallow implementation in child.
                'is_nullable'  : false,     // Allow "null" or "undefined" in properties.
                'is_read_only' : false,     // Don't generate a setter for the property.
                'is_constant'  : false,     // Is the property publicly accessible?
                'is_enum'      : false,     // Is the property an enumerator?
                'is_generated' : false,     // Is the property generated?
                'is_joii_object': false,    // Does this represent a joii class/interface ?
                'serializable' : false      // Is the property serializable?
        }, i;

        // Remove the name from the list.
        data.pop();

        // If there are no flags set, simply return the defaults.
        if (data.length === 0) {
            return metadata;
        }

        // Make sure all property flags are lowercase. We don't use Array.map
        // for this because Internet Explorer 8 (and below) doesn't know it.
        for (i in data) {
            if (typeof(g.JOII.InterfaceRegistry[data[i]]) === 'undefined' &&
                typeof(g.JOII.ClassRegistry[data[i]]) === 'undefined') {
                data[i] = data[i].toString().toLowerCase();
            }
        }

        // Shorthand for validating other flags within the same declaration.
        // If args exists in data, msg is thrown.
        var metaHas = function(args, data, msg) {
            if (typeof(args) !== 'object') {
                args = [args];
            }

            for (var i in args) {
                if (g.JOII.Compat.indexOf(data, args[i]) !== -1) {
                    throw msg;
                }
            }
        };

        for (i in data) {
            switch (data[i]) {
                case 'public':
                    metaHas('protected', data, 'Property "' + name + '" cannot be both public and protected at the same time.');
                    metaHas('private', data, 'Property "' + name + '" cannot be both public and private at the same time.');
                    metadata.visibility = 'public';
                    if (!explicit_serialize)
{
                        metadata.serializable = true;
                    }
                    break;
                case 'protected':
                    metaHas('public', data, 'Property "' + name + '" cannot be both protected and public at the same time.');
                    metaHas('private', data, 'Property "' + name + '" cannot be both protected and private at the same time.');
                    metadata.visibility = 'protected';
                    break;
                case 'private':
                    metaHas('public', data, 'Property "' + name + '" cannot be both private and public at the same time.');
                    metaHas('protected', data, 'Property "' + name + '" cannot be both private and protected at the same time.');
                    metadata.visibility = 'private';
                    break;
                case 'abstract':
                        metaHas('final', data, 'Property "' + name + '" cannot be both abstract and final at the same time.');
                    metadata.is_abstract = true;
                    break;
                case 'final':
                    metaHas('abstract', data, 'Property "' + name + '" cannot be both abstract and final at the same time.');
                    metadata.is_final = true;
                    break;
                case 'nullable':
                    metadata.is_nullable = true;
                    break;
                case 'read':
                case 'immutable':
                    metadata.is_read_only = true;
                    break;
                case 'serializable':
                    metadata.serializable = true;
                    explicit_serialize = true;
                    break;
                case 'notserializable':
                    metadata.serializable = false;
                    explicit_serialize = true;
                    break;
                case 'const':
                    metaHas(['private', 'protected', 'public'], data, 'A constant cannot have visibility modifiers.');
                    metaHas('final', data, 'A constant cannot be final.');
                    metaHas('abstract', data, 'A constant cannot be abstract.');
                    metaHas(['nullable', 'immutable', 'read'], data, 'A constant cannot be nullable or immutable.');
                    metadata.is_constant = true;
                    break;
                default:
                    if (g.JOII.Compat.indexOf(types, data[i]) !== -1) {
                        if (metadata.type !== null) {
                            throw 'Property "' + name + '" has multiple type defintions.';
                        }
                        metadata.type = data[i];
                        break;
                    }
                    // Check for Interface-types
                    if (typeof(g.JOII.InterfaceRegistry[data[i]]) !== 'undefined') {
                        metadata.is_joii_object = true;
                        metadata.type = g.JOII.InterfaceRegistry[data[i]].definition.__interface__.name;
                        break;
                    }
                    // Check for Class-types
                    if (typeof(g.JOII.ClassRegistry[data[i]]) !== 'undefined') {
                        metadata.is_joii_object = true;
                        metadata.type = g.JOII.ClassRegistry[data[i]].prototype.__joii__.name;
                        break;
                    }
                    // Check for enumerators
                    if (typeof(g.JOII.EnumRegistry[data[i]]) !== 'undefined') {
                        metadata.is_enum = true;
                        metadata.type    = data[i];
                        break;
                    }

                    throw 'Syntax error: unexpected "' + data[i] + '" in property declaration of "' + name + '".';
            }
        }

        return metadata;
    };

    g.JOII.CreatePropertyGetterSetter = function(deep_copy, meta)
    {
        "use strict";
        // If the meta type is boolean, prefix the getter with 'is'
        // rather than 'get'.
        var getter, getter_meta, getter_fn;
        if (meta.type === 'boolean') {
            if (g.JOII.CamelcaseName(meta.name).substr(0, 2) === 'Is') {
                getter = g.JOII.CamelcaseName(meta.name);
                getter = getter.substring(0, 1).toLowerCase() + getter.substring(1);
            } else {
                getter = 'is' + g.JOII.CamelcaseName(meta.name);
            }
        } else {
            getter = 'get' + g.JOII.CamelcaseName(meta.name);
        }
        var setter = 'set' + g.JOII.CamelcaseName(meta.name), setter_meta, setter_fn;

        // Create a getter
        if (typeof(deep_copy[getter]) === 'undefined') {
            getter_fn = new Function('return this["' + meta.name + '"];');
            getter_meta = g.JOII.ParseClassProperty(meta.visibility + ' function ' + getter);
            getter_meta.visibility = meta.visibility;
            getter_meta.is_abstract = meta.is_abstract;
            getter_meta.is_final = meta.is_final;
        }

        // Create a setter
        if (typeof(deep_copy[setter]) === 'undefined' && meta.is_read_only === false) {
            var nullable = meta.is_nullable, validator;

            // InstanceOf validator (in case of interfaces & classes)
            if (typeof(g.JOII.InterfaceRegistry[meta.type]) !== 'undefined' ||
                typeof(g.JOII.ClassRegistry[meta.type]) !== 'undefined') {
                validator = '\
                            if (JOII.Compat.findJOIIName(v) === \'' + meta.type + '\') {} else {\n\
                            if (v !== null && typeof(v.instanceOf) !== \'function\' || (typeof(v) === \'object\' && v !== null && typeof(v.instanceOf) === \'function\' && !v.instanceOf(\'' + meta.type + '\')) || v === null) {\n\
                                if ('+nullable+' === false || ('+nullable+' === true && v !== null && typeof(v) !== "undefined")) {\n\
                                    throw "'+setter+' expects an instance of '+meta.type+', " + (v === null ? "null" : typeof(v)) + " given.";\n\
                                }\n\
                            }};';
            } else {
                // Native type validator
                validator = '\
                            if (typeof(JOII.EnumRegistry[\'' + meta.type + '\']) !== \'undefined\') {\
                                var _e = JOII.EnumRegistry[\'' + meta.type + '\'];\
                                if (!_e.contains(v)) {\
                                    throw "'+setter+': \'" + v + "\' is not a member of enum " + _e.getName() + ".";\
                                }\
                            } else {\
                                if (typeof(v) !== \'' + meta.type + '\') {\
                                    if ('+nullable+' === false || ('+nullable+' === true && v !== null && typeof(v) !== "undefined")) {\
                                        throw "'+setter+' expects '+meta.type+', " + typeof(v) + " given.";\
                                    }\
                                };\
                            }';
            }
            setter_fn = new Function('v', (meta.type !== null ? validator : '') + 'this["' + meta.name + '"] = v; return this.__api__;');
            setter_meta = g.JOII.ParseClassProperty(meta.visibility + ' function ' + setter);
            setter_meta.visibility = meta.visibility;
            setter_meta.is_abstract = meta.is_abstract;
            setter_meta.is_final = meta.is_final;
        }

        return {
            'getter' : { name: getter, fn: getter_fn, meta: getter_meta },
            'setter' : { name: setter, fn: setter_fn, meta: setter_meta }
        };
    }

    /**
     * Creates a non-enumerable property in the given object.
     *
     * If the browser doesn't support Object.defineProperty, a regular
     * property is created instead. Please be aware that unit-tests using
     * deepEqual-assertions might fail on this using older browsers.
     *
     * @param object obj
     * @param string name
     * @param mixed  val
     */
    g.JOII.CreateProperty = function(obj, name, val, writable) {
        try {
            if (typeof(Object.defineProperty) !== 'undefined') {
                Object.defineProperty(obj, name, {
                    value        : val,
                    enumerable   : (writable === false ? true : false),
                    configurable : (writable === false ? false : true),
                    writable     : (writable === false ? false : true)
                });
                return;
            } else {
                obj[name] = val;
            }
        } catch (e) {
            obj[name] = val;
        }
    };

    /**
     * Camelcase a name.
     *
     * @param string input
     * @return string
     */
    g.JOII.CamelcaseName = function(input) {
        input = input.toLowerCase().replace(/_(.)/g, function(match, group1) {
            return group1.toUpperCase();
        });
        return input.charAt(0).toUpperCase() + input.slice(1);
    };
}(
    typeof(global) !== 'undefined' ? global : window,
    undefined
));
;/*
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

            // Apply the API object to inherited classes to keep the super() functionality working no matter how deep
            // the inheritance-chain goes.
            // This feels really 'hacky' in my opinion, but it fixes issue #19 and doesn't break any other test.
            // As far as I can tell, there's no real performance impact on this, although I'm running this on a beast
            // of a computer. If anyone has a more elegant solution, a pull-request would be much appreciated!
            if (typeof scope_in.__joii__.parent !== 'undefined') {
                var current = scope_in.__joii__.parent;
                while (typeof current !== 'undefined') {
                    current.__api__ = scope_out;
                    current = current.__joii__.parent;
                }
            }

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



            // deserialize data
            if (arguments.length == 1 && typeof arguments[0] == 'object' && '__joii_deserialize_object' in arguments[0]) {
                scope_in.deserialize(arguments[0].data);
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


        /**
         * Serializes all serializable properties of an object. Public members are serializable by default.
         *
         * @return JSON string containing the serialized class
         */
        if (typeof definition.prototype.serialize == 'undefined') {
            definition.prototype.serialize = function () {
                var obj = { __joii_type: this.__joii__.name };

                for (var key in this.__joii__.metadata) {
                    var val = this.__joii__.metadata[key];

                    if (val.serializable) {
                        if (val.is_joii_object && !val.is_enum && typeof this[val.name] == 'object' && this[val.name] != null) {
                            obj[val.name] = JSON.parse(this[val.name].serialize());
                        }
                        else {
                            obj[val.name] = this[val.name];
                        }
                    }
                }

                return JSON.stringify(obj);
            };
        }


        /**
         * Deserializes a class (called on an object instance to populate it)
         *
         * @param JSON or object representing an instance of this class
         * @return void
         */
        if (typeof definition.prototype.deserialize == 'undefined') {
            definition.prototype.deserialize = function (jsonOrRawObject) {
                var obj = jsonOrRawObject;

                if (typeof jsonOrRawObject == 'string') {
                    obj = JSON.parse(jsonOrRawObject);
                }

                for (var key in (this.__joii__.metadata)) {
                    var val = this.__joii__.metadata[key];

                    if (val.serializable) {
                        if (val.name in obj && typeof obj[val.name] != 'function') {
                            if (typeof obj[val.name] == 'object' && obj[val.name] != null && '__joii_type' in (obj[val.name])) {
                                var name = obj[val.name].__joii_type;
                                // Check for Interface-types
                                if (typeof (g.JOII.InterfaceRegistry[name]) !== 'undefined') {
                                    throw 'Cannot instantiate an interface.';
                                }
                                    // Check for Class-types
                                else if (typeof (g.JOII.ClassRegistry[name]) !== 'undefined') {
                                    this[val.name] = g.JOII.ClassRegistry[name].deserialize(obj[val.name]);
                                }
                                else {
                                    throw 'Class ' + name + ' not currently in scope!';
                                }
                            }
                            else {
                                this[val.name] = obj[val.name];
                            }
                        }
                    }
                }
            };
        }

        /**
         * Deserializes a class (called as a static method - instantiates a new object and populates it)
         *
         * @param JSON or object representing an instance of this class
         * @return void
         */
        definition.deserialize = function (jsonOrRawObject) {
            var deserializeObject = {
                '__joii_deserialize_object': true,
                'data': jsonOrRawObject
            };
            return new definition(deserializeObject);
        };

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
));;/*
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

    // The registry contains a set of interfaces indexed by a GUID.
    g.JOII.InterfaceRegistry = {};

    /**
     * Builds an interface for a class to enforce implementation and signature
     * of a set of properties and methods.
     *
     * @param [name]
     * @param [parameters]
     * @param body
     */
    g.JOII.InterfaceBuilder = function() {

        var args        = g.JOII.Compat.ParseArguments(arguments),
            name        = args.name,
            parameters  = args.parameters,
            body        = args.body;

        // Start by creating a prototype based on the parameters and body.
        // The definition will be the resulting function containing all
        // required information about this interface.
        var prototype  = g.JOII.PrototypeBuilder(name, parameters, body, true),
            definition = function(prototype)
            {
                var reflector = new g.JOII.Reflection.Class(prototype),
                    properties = this.reflector.getProperties(),
                    methods = this.reflector.getMethods(),
                    i, p1, p2;

                // If the class is marked as 'abstract', running interface validation
                // on it is rather useless since the class can't be instantiated.
                if (reflector.isAbstract()) {
                    return true;
                }

                var verifyMeta = function (t, p1, p2, prefix) {
                    if (p1.getVisibility() !== p2.getVisibility()) {
                        throw prefix + ' ' + p2.getName() + ' cannot be ' + p2.getVisibility() + ' because the interface declared it ' + p1.getVisibility() + '.';
                    }
                    if (p1.getType() !== p2.getType()) {
                        throw prefix + ' ' + p2.getName() + ' cannot be declared as ' + p2.getType() + ' because the interface declared it as ' + p1.getType() + '.';
                    }
                    if (p1.isNullable() !== p2.isNullable()) {
                        throw prefix + ' ' + p2.getName() + ' must be nullable as defined in the interface ' + t.name + '.';
                    }
                    return true;
                };


                // Verify that all properties exist and have the correct metadata.
                for (i in properties) {
                    p1 = properties[i];

                    if (!reflector.hasProperty(p1.getName())) {
                        throw 'Class must implement ' + (p1.toString().split(':')[0]) + ' as defined in the interface ' + this.name + '.';
                    }
                    p2 = reflector.getProperty(p1.getName());

                    // Verify meta data
                    verifyMeta(this, p1, p2, 'Property');
                }

                // Verify methods.
                for (i in methods) {
                    p1 = methods[i];
                    if (!reflector.hasMethod(p1.getName())) {
                        throw 'Class must implement ' + (p1.toString().split(':')[0]) + ' as defined in the interface ' + this.name + '.';
                    }
                    p2 = reflector.getMethod(p1.getName());

                    // Verify meta data
                    verifyMeta(this, p1, p2, 'Method');

                    // Verify function signature.
                    if (p1.getParameters().length !== p2.getParameters().length) {
                        throw 'Method ' + p1.getName() + ' does not match the parameter count as defined in the interface ' + this.name + '.';
                    }
                }
            };

        // Set our interface specification
        g.JOII.CreateProperty(definition, '__interface__', {
            prototype : prototype,
            reflector : new g.JOII.Reflection.Class(prototype),
            name      : name
        });

        // And the standard JOII-metadata.
        g.JOII.CreateProperty(definition, '__joii__', prototype.__joii__);

        var constructor = g.JOII.Compat.Bind(definition, definition.__interface__);
        constructor.prototype = prototype;

        // Properties and methods may ever be declared as abstract or final in
        // an interface definition, because that wouldn't make any sense in
        // this context.
        var properties = definition.__interface__.reflector.getProperties(),
            methods    = definition.__interface__.reflector.getMethods(),
            validate   = function(prop, prefix) {
            if (prop.isAbstract()) {
                throw 'An interface may not contain abstract definitions. ' + prefix + ' ' + prop.getName() + ' is abstract in interface ' + definition.__interface__.name + '.';
            }
            if (prop.isFinal()) {
                throw 'An interface may not contain final definitions. ' + prefix + ' ' + prop.getName() + ' is final in interface ' + definition.__interface__.name + '.';
            }
        };

        // Validate properties and methods.
        var i;
        for (i in properties) {
            validate(properties[i], 'Property');
        }
        for (i in methods) {
            validate(methods[i], 'Method');
        }

        // Apply the definition to the constructor to have access to metadata
        // without running or instantiating the function.
        g.JOII.CreateProperty(constructor, 'definition', definition);

        // Register the interface, making it available in the PrototypeBuilder
        // to use as a type in property definitions.
        if (typeof(g.JOII.InterfaceRegistry[name]) !== 'undefined') {
            throw 'Another interface with the name "' + name + '" already exists.';
        }
        if (g.JOII.Compat.indexOf(g.JOII.InternalTypeNames, name) !== -1) {
            throw 'An interface may not be named "' + name + '", becase that name is reserved.';
        }

        // Apply constants to the definition
        var constants = {};
        for (i in prototype.__joii__.constants) {
            g.JOII.CreateProperty(constructor, i, prototype.__joii__.constants[i], false);
            constants[i] = prototype.__joii__.constants[i];
        }

        // Does the class implement an enumerator?
        if (typeof(parameters['enum']) === 'string') {
            var e = g.JOII.EnumBuilder(parameters['enum'], constants);
            if (parameters.expose_enum === true) {
                if (typeof(g[parameters['enum']]) !== 'undefined') {
                    throw 'Cannot expose Enum "' + parameters['enum'] + '" becase it already exists in the global scope.';
                }
                g[parameters['enum']] = e;
            }
        }

        g.JOII.InterfaceRegistry[name] = constructor;

        return constructor;
    };
}(
    typeof(global) !== 'undefined' ? global : window,
    undefined
));;/*
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
));;/*
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
    g.JOII.Reflection = {};

    /**
     * ReflectionClass
     *
     * Retrieves and presents meta information about the given class.
     *
     * API / Usage:
     *      var r = new JOII.Reflection.Class(MyClass);
     *      r.getMethods();      - Returns array of JOII.Reflection.Method
     *      r.getMethod(name);   - Returns JOII.Reflection.Method
     *      r.getProperties();   - Returns array of JOII.Reflection.Property
     *      r.getProperty(name); - Returns JOII.Reflection.Property
     *      r.isFinal()          - Returns true if the class is final
     *      r.hasParent()        - Returns true if the class has a parent
     *      r.getParent()        - Returns JOII.Reflection.Class of the parent
     */
    g.JOII.Reflection.Class = g.JOII.ClassBuilder({}, {

        /**
         * Contains the __joii__ metadata object.
         *
         * @var object
         */
        'protected immutable object meta'  : null,

        /**
         * Contains the prototype of the class.
         *
         * @var object
         */
        'protected immutable object proto' : null,

        /**
         * Represents the Reflection.Class instance of the parent definition.
         *
         * @var JOII.Reflection.Class
         */
        'public immutable object parent'   : null,

        /**
         * Constructor
         *
         * @param function definition
         */
        'protected __construct': function(definition) {

            if (typeof(definition) === 'function') {
                definition = definition.prototype;
            }

            // Is the passed argument an actual JOII class?
            if (typeof(definition) !== 'object' ||
                typeof(definition.__joii__) !== 'object') {
                throw 'Reflection.Class requires a JOII-created definition.';
            }

            this.proto = definition;
            this.meta  = definition.__joii__;

            // Does the class definition have a parent?
            if (typeof(this.meta.parent) !== 'undefined') {
                this.parent = new g.JOII.Reflection.Class(this.meta.parent);
            }
        },

        /**
         * Returns the name of the class.
         *
         * @return string
         */
        'public getName': function() {
            return this.meta.name;
        },

        /**
         * Returns true if the class is marked as abstract.
         *
         * @return bool
         */
        'public isAbstract': function() {
            return this.meta.is_abstract === true;
        },

        /**
         * Returns true if a property by the given name exists.
         *
         * @return bool
         */
        'public hasProperty': function(name) {
            var list = this.getProperties();
            for (var i in list) {
                if (list[i].getName() === name) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Returns true if the class being reflected has a parent class.
         *
         * @return bool
         */
        'public hasParent': function() {
            return this.parent !== null;
        },

        /**
         * Returns the reflector of the parent class.
         *
         * @return JOII.Reflection.Class
         */
        'public getParent': function() {
            return this.parent;
        },

        /**
         * Returns an array of JOII.Reflection.Method based on the methods
         * defined in this class.
         *
         * @param  string filter Optional filter for 'private' or 'public'.
         * @return JOII.Reflection.Method[]
         */
        'public getMethods': function(filter) {
            var result = [];
            for (var i in this.proto) {
                if (typeof(this.proto[i]) === 'function' && g.JOII.Compat.indexOf(g.JOII.InternalPropertyNames, i) === -1) {
                    result.push(new g.JOII.Reflection.Method(this, i));
                }
            }
            return result;
        },

        /**
         * Returns true if a method by the given name exists.
         *
         * @return bool
         */
        'public hasMethod': function(name) {
            var list = this.getMethods();
            for (var i in list) {
                if (list[i].getName() === name) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Returns an instance of JOII.Reflection.Method of a method by the
         * given name.
         *
         * @param  string name
         * @return JOII.Reflection.Method
         */
        'public getMethod' : function(name) {
            var list = this.getMethods();
            for (var i in list) {
                if (list[i].getName() === name) {
                    return list[i];
                }
            }
            throw 'Method "' + name + '" does not exist.';
        },

        /**
         * Returns an array of JOII.Reflection.Property based on the properties
         * defined in this class.
         *
         * @param  string filter Optional filter for 'private' or 'public'.
         * @return JOII.Reflection.Property[]
         */
        'public getProperties' : function(filter) {
            var result = [];
            for (var i in this.proto) {
                if (typeof(this.proto[i]) !== 'function' && g.JOII.Compat.indexOf(g.JOII.InternalPropertyNames, i) === -1) {
                    result.push(new g.JOII.Reflection.Property(this, i));
                }
            }
            return result;
        },

        /**
         * Returns an instance of JOII.Reflection.Property of a property by the
         * given name.
         *
         * @param  string name
         * @return JOII.Reflection.Property
         */
        'public getProperty' : function(name) {
            var list = this.getProperties();
            for (var i in list) {
                if (list[i].getName() === name) {
                    return list[i];
                }
            }
            throw 'Property "' + name + '" does not exist.';
        }
    });

    /**
     * Defines a property declared in a JOII class and provides meta
     * information about it.
     */
    g.JOII.Reflection.Property = g.JOII.ClassBuilder({}, {

        /**
         * Represents the reflector of the owning class.
         *
         * @var JOII.Reflection.Class
         */
        'protected nullable object reflector' : null,

        /**
         * Represents the metadata of this property.
         *
         * @var object
         */
        'protected nullable object meta' : null,

        /**
         * Represents the name of the property.
         *
         * @var string
         */
        'public read string name' : null,

        /**
         * Constructor.
         *
         * @param JOII.Reflection.Class reflector
         * @param string property_name
         */
        'protected __construct': function(reflector, property_name)
        {
            this.reflector = reflector;
            this.name      = property_name;
            this.meta      = reflector.getMeta().metadata[property_name];

            // If we, for some strange reason don't have metadata, fill it in
            // with some default values.
            if (typeof(this.meta) === 'undefined') {
                this.meta = {
                    name        : this.name,
                    type        : null,
                    visibility  : 'public',
                    is_nullable : false,
                    is_abstract : false,
                    is_read_only: false,
                    is_final    : false
                };
            }

            // Attempt to fetch the type by fetching the predefined value.
            // However, only do this for non-nullable types to avoid type
            // mismatching exceptions in setters.
            if (this.meta.type === null && this.meta.is_nullable === false) {
                this.meta.type = typeof(this.reflector.getProto()[this.meta.name]);
            }
        },

        /**
         * Returns the type of the property.
         *
         * @return string
         */
        'public getType': function() {
            return this.meta.type;
        },

        /**
         * Returns true if the property is abstract.
         *
         * @return bool
         */
        'public isAbstract': function() {
            return this.meta.is_abstract;
        },

        /**
         * Returns true if the property is nullable.
         *
         * @return bool
         */
        'public isNullable': function() {
            return this.meta.is_nullable;
        },

        /**
         * Returns true if the property is final.
         *
         * @return bool
         */
        'public isFinal': function() {
            return this.meta.is_final;
        },

        /**
         * Returns true if the property is private.
         *
         * @return bool
         */
        'public isPrivate': function() {
            return this.meta.visibility === 'private';
        },

        /**
         * Returns true if the property is protected.
         *
         * @return bool
         */
        'public isProtected': function() {
            return this.meta.visibility === 'protected';
        },

        /**
         * Returns true if the property is public.
         *
         * @return bool
         */
        'public isPublic': function() {
            return this.meta.visibility === 'public';
        },

        /**
         * Returns true if the property is public.
         *
         * @return bool
         */
        'public isImmutable': function() {
            return this.meta.is_read_only;
        },

        /**
         * Returns true if the property is a constant.
         *
         * @return bool
         */
        'public isConstant': function() {
            return this.meta.is_constant;
        },

        /**
         * Returns true if the given type matches the type of this property.
         *
         * @param string type
         * @return bool
         */
        'public isType': function(type) {
            return type === this.meta.type;
        },

        /**
         * Returns the visibility of the property as a string.
         *
         * @return string
         */
        'public getVisibility': function() {
            return this.meta.visibility;
        },

        /**
         * Returns a string representation of this object.
         *
         * @return string
         */
        toString: function() {
            var name_parts = [],
                proto_ref  = this.reflector.getProto()[this.name],
                name       = '',
                body       = '';

            if (this.meta.is_abstract) { name_parts.push('abstract'); }
            if (this.meta.is_final) { name_parts.push('final'); }

            name_parts.push(this.meta.visibility);

            if (this.meta.is_nullable) { name_parts.push('nullable'); }
            if (this.meta.is_read_only) { name_parts.push('read'); }

            // If type === null, attempt to detect it by the predefined value.
            if (this.meta.type === null) {
                if (proto_ref === null) {
                    name_parts.push('mixed');
                } else {
                    name_parts.push(typeof(proto_ref));
                }
            } else {
                name_parts.push(this.meta.type);
            }

            name_parts.push('"' + this.meta.name + '"');
            name = name_parts.join(' ');

            if (typeof(proto_ref) === 'function') {
                body = '[Function]';
            } else if(typeof(proto_ref) === 'object' && proto_ref !== null) {
                body = '[Object (' + proto_ref.length + ')]';
            } else if (typeof(proto_ref) === 'string') {
                body = '"' + proto_ref + '"';
            } else {
                body = proto_ref;
            }
            return name + ': ' + body;
        }
    });

    g.JOII.Reflection.Method = g.JOII.ClassBuilder({ 'extends': g.JOII.Reflection.Property }, {

        /**
         * Returns an array of strings based on the parameters defined in
         * the declared function.
         *
         * @return string[]
         */
        'public getParameters': function() {
            var FN_ARGS        = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
                FN_ARG_SPLIT   = /,/,
                FN_ARG         = /^\s*(_?)(\S+?)\1\s*$/,
                STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
                getParams      = function(fn) {
                var fnText, argDecl;
                var args=[];
                fnText  = fn.toString().replace(STRIP_COMMENTS, '');
                argDecl = fnText.match(FN_ARGS);

                var r = argDecl[1].split(FN_ARG_SPLIT), repl = function(all, underscore, name) {
                    args.push(name);
                };
                for (var a in r) {
                    var arg = r[a];
                    arg.replace(FN_ARG, repl);
                }

                return args;
            };

            return getParams(this.reflector.getProto()[this.name]);
        },

        /**
         * Returns the body of this method as a string.
         *
         * @return string
         */
        'public getBodyAsString': function(f)
        {
            var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
                fn_text        = this.reflector.getProto()[this.name].toString().replace(STRIP_COMMENTS, '');

            return fn_text.substr(fn_text.indexOf('{') + 1, fn_text.lastIndexOf('}') - 4).replace(/}([^}]*)$/,'$1');
        },

        /**
         * Returns true if the function body contains "arguments", making
         * a _guess_ the function uses variadic arguments.
         *
         * This is only used in toString() to show an indication of the
         * function signature. Do NOT rely on this in functional code!!
         *
         * @return bool
         */
        'public usesVariadicArguments': function() {
            var data = this.reflector.getProto()[this.name].toString();
            return data.match(/[\(|\.|\ ](arguments)[\)|\.|\,|\ |]/g);
        },

        /**
         * Returns a string representation of the method.
         *
         * @return string
         */
        toString: function() {

            // Get the "declaration" part of the method.
            var prefix = this['super']('toString').split(':')[0],
                body   = '[Function',
                args   = this.getParameters(),
                is_var = this.usesVariadicArguments();

            if (args.length > 0) {
                body += ' (' + args.join(', ');
                if (is_var) {
                    body += ', ...';
                }
                body += ')';
            } else if (args.length === 0 && is_var) {
                body += ' (...)';
            }

            body += ']';
            return prefix + ': ' + body;
        }
    });
}(
    typeof(global) !== 'undefined' ? global : window,
    undefined
));
;/*
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
;/*
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