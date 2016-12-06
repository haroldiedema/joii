/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
'use strict';

(function (factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(exports);
    } else {
        // Browser globals
        factory(window);
    }

} (function (root)
{
    // allows use as both raw source in the browser and compiled dist
    // easier to test/debug when using the raw source
    root = typeof (root) !== 'undefined' ? root : {};
    var JOII = typeof (root.JOII) !== 'undefined' ? root.JOII : {};

    /* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/

// Need this to be in scope for internal functions, but don't want to expose it outside
// this will be inside the closure after compile, while still being available in global scope for src testing
var inner_static_objects = {};



JOII = typeof (JOII) !== 'undefined' ? JOII : {};
JOII.Config = {
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
        if (JOII.Config.constructors.indexOf(name) !== -1) {
            return;
        }

        JOII.Config.constructors.push(name);
    },

    /**
     * Removes a constructor method name. The first occurance of a function
     * named like one of these is executed. The rest is ignored to prevent
     * ambiguous behavior.
     *
     * @param {string} name
     */
    removeConstructor: function(name) {
        if (JOII.Config.constructors.indexOf(name) === -1) {
            return;
        }

        JOII.Config.constructors.splice(JOII.Config.constructors.indexOf(name), 1);
    },

    /**
     * Adds a callable method name, like __call. Only one of these is
     * executed if more than one exist to prevent ambiguous behaviour.
     *
     * @param {string} name
     */
    addCallable: function (name) {
        if (JOII.Config.callables.indexOf(name) !== -1) {
            return;
        }

        JOII.Config.callables.push(name);
    },

    /**
     * Removes a callable method name, like __call. Only one of these is
     * executed if more than one exist to prevent ambiguous behaviour.
     *
     * @param {string} name
     */
    removeCallable: function(name) {
        if (JOII.Config.callables.indexOf(name) === -1) {
            return;
        }

        JOII.Config.callables.splice(JOII.Config.callables.indexOf(name), 1);
    }
};
/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/

JOII = typeof (JOII) !== 'undefined' ? JOII : {};
JOII.Compat = {};

/**
 * Finds and returns the name of a JOII-generated object or false if it doesn't
 * exist.
 *
 * @param  {Object|Function} e
 * @return {String|Boolean}
 */
JOII.Compat.findJOIIName = function(e) {
    var i, r;

    if (typeof (e) === 'string' ||
        typeof (e) === 'number' ||
        typeof (e) === 'undefined' ||
        e === null
    ) {
        return false;
    }

    if (typeof (e.__joii__) !== 'undefined') {
        return e.__joii__.name;
    }
    if (typeof (e.prototype) !== 'undefined' && typeof (e.prototype.__joii__) !== 'undefined') {
        return e.prototype.__joii__.name;
    }

    // Chrome / FF // IE 11+
    if (typeof (e.__proto__) !== 'undefined') {
        r = JOII.Compat.findJOIIName(e.__proto__);
        if (typeof (r) === 'string') {
            return r;
        }
    }

    if (typeof (e) === 'function') {
        e = e.prototype;
    }

    for (i in e) {
        if (e.hasOwnProperty(i) === false) continue;
        if (typeof (e[i]) === 'function' || typeof (e[i]) === 'object') {
            r = JOII.Compat.findJOIIName(e[i]);
            if (typeof (r) === 'string') {
                return r;
            }
        }
    }

    return false;
};

/**
 * Array.indexOf implementation.
 *
 * @param  {Array} array
 * @param  {*}     elt
 * @return {Number}
 */
JOII.Compat.indexOf = function(array, elt) {

    if (typeof (array.indexOf) === 'function') {
        return array.indexOf(elt);
    }

    var len = array.length >>> 0,
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
JOII.Compat.extend = function() {
    var options, src, copy, copyIsArray = false, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;
    if (typeof target === "boolean") {
        deep = target; target = arguments[i] || {}; i++;
    }
    if (typeof target !== "object" && typeof (target) !== "function") {
        target = {};
    }
    for (; i < length; i++) {
        options = arguments[i];
        if (options !== null && arguments[i] !== undefined) {

            if (typeof (options.__joii__) !== 'undefined') {
                JOII.CreateProperty(target, '__joii__', options.__joii__);
            }

            for (var name in options) {
                // Do NOT check 'hasOwnProperty' here. The universe will implode.
                src = target[name];
                copy = options[name];
                if (target === copy) { continue; }
                if (deep && copy && (JOII.Compat.isPlainObject(copy) || (copyIsArray = JOII.Compat.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && JOII.Compat.isArray(src) ? src : [];
                    } else {
                        clone = src && JOII.Compat.isPlainObject(src) ? src : {};
                    }
                    target[name] = JOII.Compat.extend(deep, clone, copy);
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
 * @param  {Object} obj
 * @return {Boolean}
 */
JOII.Compat.isArray = function(obj) {
    var length = obj.length,
        type = typeof (obj);

    if (type === "function" || (typeof (window) !== 'undefined' && obj === window)) {
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
 * @param  {Object} obj
 * @return {Boolean}
 */
JOII.Compat.isPlainObject = function(obj) {
    var hasOwn = ({}).hasOwnProperty;
    if (typeof (obj) !== "object" || obj.nodeType || (typeof (window) !== 'undefined' && obj === window)) {
        return false;
    }

    return !(obj.constructor && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf"));
};

/**
 * JOII.Compat.CreateObject implementation
 *
 * @param  {Object} o
 * @return {Object}
 */
JOII.Compat.CreateObject = function(o) {

    if (typeof (Object.create) === 'function') {
        return Object.create(o);
    }

    var c = (function() {
        function Class() { }
        return function(o) {
            if (arguments.length != 1) {
                throw new Error('JOII.Compat.CreateObject implementation only accepts one parameter.');
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
 * @param  {Function} fn
 * @param  {Object}   context
 * @return {Function}
 */
JOII.Compat.Bind = function(fn, context) {
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
JOII.Compat.GenerateUUID = function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    return s.join("");
};

/**
 * Returns an object consisting of name, parameters and body depending on
 * the amount of parameters given.
 *
 * If no name is specified (argument[0] === string), a generated UUID will
 * take its place.
 *
 * @param  {Object} args
 * @return {Object}
 */
JOII.Compat.ParseArguments = function(args) {
    var result = { name: '', parameters: {}, body: {} };

    switch (args.length) {
        // Zero-arguments. Unlikely, but valid for classes and interfaces.
        case 0:
            result.name = JOII.Compat.GenerateUUID();
            break;
        // One argument. Name or body.
        case 1:
            if (typeof (args[0]) === 'string') {
                result.name = args[0];
            }
            if (typeof (args[0]) === 'object') {
                result.name = JOII.Compat.GenerateUUID();
                result.body = args[0];
            }
            break;
        // Two arguments: Name & Body or Parameters & Body
        case 2:
            if (typeof (args[0]) === 'string') {
                result.name = args[0];
            }
            if (typeof (args[0]) === 'object') {
                result.name = JOII.Compat.GenerateUUID();
                result.parameters = args[0];
            }
            result.body = args[1];
            break;
        // Three parameters: pass them all.
        case 3:
            result.name       = args[0];
            result.parameters = args[1];
            result.body = args[2];
        case 4:
            result.name = args[0];
            result.parameters = args[1];
            result.body = args[2];
            result.is_static_generated = args[3];
    }

    // Validate the results.
    if (typeof (result.name) !== 'string' ||
        typeof (result.parameters) !== 'object' ||
        (typeof (result.body) !== 'object' && typeof (result.body) !== 'function')) {
        throw 'Invalid parameter types given. Expected: ([[[string], object], <object|function>]).';
    }

    return result;
};

/**
 * Some parameters can be passed as a string, object or array of both. This
 * function will parse the argument and return an array of actual objects.
 *
 * @param  {*} arg
 * @param  {Boolean} deep
 * @return {Object}
 */
JOII.Compat.flexibleArgumentToArray = function(arg, deep) {
    if (typeof (arg) === 'object' && !JOII.Compat.isArray(arg) && typeof (arg[0]) === 'undefined') {
        return [deep ? JOII.Compat.extend(true, {}, arg) : arg];
    } else if (typeof (arg) === 'function') {
        return [deep ? JOII.Compat.extend(true, {}, arg.prototype) : arg.prototype];
    } else if (typeof (arg) === 'object' && JOII.Compat.isArray(arg)) {
        var result = [];
        for (var i in arg) {
            result.push(JOII.Compat.flexibleArgumentToArray(arg[i], false)[0]);
        }
        return result;
    } else {
        throw 'Unable to read ' + typeof (arg) + '. Object, function or array expected.';
    }
};


JOII.Compat.canTypeBeCastTo = function(val, cast_to_type) {
    // InstanceOf validator (in case of interfaces & classes)
    if (typeof (JOII.InterfaceRegistry[cast_to_type]) !== 'undefined' ||
        typeof (JOII.ClassRegistry[cast_to_type]) !== 'undefined') {

        if (JOII.Compat.findJOIIName(val) !== cast_to_type) {
            if (val !== null && (typeof (val.instanceOf) !== 'function' || (typeof (val) === 'object' && typeof (val.instanceOf) === 'function' && !val.instanceOf(cast_to_type)))) {
                return false;
            }
        }
    } else {
        // Native val validator
        if (typeof (JOII.EnumRegistry[cast_to_type]) !== 'undefined') {
            var _e = JOII.EnumRegistry[cast_to_type];
            if (!_e.contains(val)) {
                return false; // Should we really be validating that it fits inside the enum?
            }
        } else {
            if (typeof (val) !== cast_to_type) {
                return false;
            }
        }
    }
    // nothing failed, so should be compatible
    return true;
};/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/

JOII = typeof (JOII) !== 'undefined' ? JOII : {};

JOII.InternalPropertyNames = ['__joii__', 'super', 'instanceOf', 'deserialize', 'serialize', 'getStatic', '__api__'];
JOII.InternalTypeNames     = [
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
 * @param  {String}  name
 * @param  {Object}  parameters
 * @param  {Object}  body
 * @param  {Boolean} is_interface
 * @return {Object}
 */
JOII.PrototypeBuilder = function(name, parameters, body, is_interface, is_static_generated) {

    is_static_generated = (is_static_generated === true);

    // Create a clean prototype of the class body.
    var prototype = {},
        deep_copy = JOII.Compat.extend(true, {}, body);

    // Create the internal JOII-object.
    JOII.CreateProperty(prototype, '__joii__', {
        name            : name,
        parent          : undefined,
        metadata        : {},
        constants       : {},
        implementations : [name],
        is_abstract     : parameters.abstract === true,
        is_final        : parameters.final === true,
        is_static       : parameters['static'] === true || is_static_generated
    });

    // Apply traits / mix-ins
    if (typeof (parameters.uses) !== 'undefined') {
        var traits = JOII.Compat.flexibleArgumentToArray(parameters.uses);
        for (var t in traits) {
            deep_copy = JOII.Compat.extend(true, deep_copy, traits[t]);
        }
    }

    if (prototype.__joii__.is_abstract && prototype.__joii__.is_final) {
        throw 'A class cannot be both abstract and final simultaniously.';
    }

    // Iterate over properties from the deep_copy, get the metadata of the
    // property and move them in the prototype.
    for (var i in deep_copy) {
        if (deep_copy.hasOwnProperty(i) === false) continue;
        var meta = JOII.ParseClassProperty(i, name);

        
        // make sure this prototype only has members that match it's static state
        if (prototype.__joii__['is_static'] !== true && meta.is_static && !is_interface) continue;
        if (prototype.__joii__['is_static'] && !meta.is_static) {
            if (is_static_generated) {
                continue;
            } else {
                throw 'Member ' + meta.name + ' is non-static. A static class cannot contain non-static members.';
            }
        }

        if (typeof (deep_copy[i]) === 'function' || meta.parameters.length > 0 || (meta.name in prototype.__joii__.metadata && 'overloads' in prototype.__joii__.metadata[meta.name])) {
            if (typeof (deep_copy[i]) !== 'function') {
                if (meta.parameters.length > 0) {
                    throw 'Member ' + meta.name + ' specifies parameters, but it\'s value isn\'t a function.';
                } else {
                    throw 'Member ' + meta.name + ' overloads an existing function, but it\'s value isn\'t a function.';
                }
            }
            if (meta.name in prototype && typeof (prototype[meta.name]) !== 'function') {
                throw 'Member ' + meta.name + ' overloads an existing property, but the previous property isn\'t a function.';
            }

            meta.class_name = name;

            JOII.addFunctionToPrototype(prototype, meta, deep_copy[i]);

        } else if (meta.is_constant) {
            prototype.__joii__.constants[meta.name] = deep_copy[i];
            JOII.CreateProperty(prototype, meta.name, deep_copy[i], false);

            meta.class_name = name;

            prototype.__joii__.metadata[meta.name] = meta;
        } else {
            prototype[meta.name] = deep_copy[i];

            meta.class_name = name;

            prototype.__joii__.metadata[meta.name] = meta;
        }

        // Don't create getters and setters if we are an interface.
        if (is_interface === true) {
            continue;
        }
    }

    if (typeof (parameters.abstract) !== 'undefined') {
        prototype.__joii__.is_abstract = true;
        if (is_interface) {
            throw 'An interface cannot be declared abstract.';
        }
    }

    if (prototype.__joii__.is_static && is_interface) {
        throw 'An interface cannot be declared static.';
    }
    
    // Create getters and setters for properties. We do this _after_ the
    // copying of the parent object because that prototype doesn't contain
    // the getter/setter methods yet. (Fixes issue #10)
    // NOTE: The comment implies that this will apply getters/setters for inherited properties
    // however, it's only looping over "deep_copy", which only contains information from this class
    // it doesn't contain parent properties...
    // Moved back above the parent implementations, so that the getter/setters for this class
    // take priority over inherited (applies to static overloaded accessor methods)
    for (var i in deep_copy) {
        if (deep_copy.hasOwnProperty(i) === false) continue;
        var meta = JOII.ParseClassProperty(i, name);
        
        if (typeof (deep_copy[i]) === 'function' || meta.parameters.length > 0 || 'overloads' in meta) {
            continue;
        }

        // make sure this prototype only has members that match it's static state
        if (prototype.__joii__['is_static'] !== true && meta.is_static && !is_interface) continue;
        if (prototype.__joii__['is_static'] && !meta.is_static) {
            if (is_static_generated) {
                continue;
            } else {
                throw 'Member ' + meta.name + 'is non-static. A static class cannot contain non-static members.';
            }
        }
        
        // Generate getters and setters if we're not dealing with anything
        // that is a function or declared private.
        if (meta.visibility !== 'private') {

            var gs = JOII.CreatePropertyGetterSetter(deep_copy, meta, name);
            gs.getter.meta.class_name = name;
            
            if (typeof (prototype.__joii__.metadata[gs.getter.name]) == 'undefined' || !prototype.__joii__.metadata[gs.getter.name].has_parameterless) {
                JOII.addFunctionToPrototype(prototype, gs.getter.meta, gs.getter.fn, true);
            }

            //prototype[gs.getter.name] = gs.getter.fn;
            //prototype.__joii__.metadata[gs.getter.name] = gs.getter.meta;

            if (typeof (gs.setter.meta) !== 'undefined') {
                gs.setter.meta.class_name = name;
                if (typeof (prototype.__joii__.metadata[gs.getter.name]) == 'undefined' || !prototype.__joii__.metadata[gs.getter.name].has_parameterless) {
                    JOII.addFunctionToPrototype(prototype, gs.setter.meta, gs.setter.fn, true);
                }

                //prototype[gs.setter.name] = gs.setter.fn;
                //prototype.__joii__.metadata[gs.setter.name] = gs.setter.meta;
            }
        }
    }


    // Apply the parent prototype.
    if (typeof (parameters['extends']) !== 'undefined') {
        var parent = parameters['extends'];

        // If the given parent is a function, use its prototype.
        if (typeof (parent) === 'function') {
            if (is_static_generated) {
                parent = parent.__joii__.prototype;
            } else {
                parent = parent.prototype;
            }
        }

        // Only Object-types can be used as a parent object.
        if (typeof (parent) !== 'object' && !is_static_generated) {
            throw (is_interface ? 'An interface' : 'A class') + ' may only extend on functions or object-types.';
        }

        // Create a parent property in the prototype which contains a deep-
        // copy of the prototype of the given parent.
        prototype.__joii__.parent = JOII.Compat.extend(true, {}, parent);

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
        prototype.__joii__.constants = JOII.Compat.extend(true, prototype.__joii__.constants, parent.__joii__.constants);

        // The __joii__ property is usually hidden and not enumerable, so we
        // need to re-create it ourselves.
        JOII.CreateProperty(prototype.__joii__.parent, '__joii__', (parent.__joii__));

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
            if (JOII.Compat.indexOf(JOII.InternalPropertyNames, i) !== -1) {
                continue;
            }

            var property      = prototype.__joii__.parent[i];
            var property_meta = prototype.__joii__.parent.__joii__.metadata[i];
            var proto_meta    = prototype.__joii__.metadata[i];
            
            // make sure this prototype only has members that match it's static state
            if (prototype.__joii__['is_static'] !== true && property_meta.is_static && !is_interface) continue;
            if (prototype.__joii__['is_static'] && !property_meta.is_static) {
                if (is_static_generated) {
                    continue;
                } else {
                    throw 'Member ' + property_meta.name + 'is non-static. A static class cannot contain non-static members.';
                }
            }

            if (typeof (proto_meta) === 'undefined') {
                proto_meta = prototype.__joii__.metadata[i] = JOII.Compat.extend(true, {}, property_meta);
                proto_meta.has_parameterless = false;
                if ('overloads' in proto_meta) {
                    delete proto_meta.overloads;
                }
            }

            // If another property with the same name already exists within
            // our own prototype, skip its inherited implementation.
            if (typeof (prototype[i]) !== 'undefined' &&
                typeof (property_meta) === 'object' &&
                typeof (proto_meta) === 'object') {

                if (proto_meta.is_generated === false) {
                    // Check for visibility change.
                    if (property_meta.visibility !== proto_meta.visibility) {
                        throw 'Member "' + i + '" must be ' + property_meta.visibility + ' as defined in the parent ' + (is_interface ? 'interface' : 'class') + '.';
                    }

                    if (typeof (property) === 'function' || property_meta.parameters.length > 0 || 'overloads' in proto_meta || 'overloads' in property_meta) {
                        // if it's a function, don't check the following.
                        // is_final is checked when adding the function later
                        // read_only and nullable don't apply to functions
                    } else {
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

                }
                if (typeof (property) === 'function' || property_meta.parameters.length > 0 || 'overloads' in proto_meta || 'overloads' in property_meta) {
                    // if it's a function, we still want to proceed
                } else {
                    continue;
                }
            }

            if (typeof (property) === 'function' || property_meta.parameters.length > 0 || 'overloads' in proto_meta || 'overloads' in property_meta) {
                // if it's a function, we still want to proceed
            } else {
                // It's safe to apply non-function properties immediatly.
                if (typeof (property) !== 'function' || is_interface === true) {

                    if (!property_meta.is_static) {
                        prototype[i] = property;
                    }

                    // if it's static, we need to reference the original functions, since static members stay with the class they're defined in
                    if (property_meta.is_static) {
        
                        var gs = JOII.CreatePropertyGetterSetter(prototype, property_meta, name);
                        
                        gs.getter.fn = Function('\
                            var args = ["' + gs.getter.name + '"];\
                            for (var i in arguments) { args.push(arguments[i]); }\
                            return this[\'super\'].apply(this, args);\
                        ');
                        gs.setter.fn = Function('\
                            var args = ["' + gs.setter.name + '"];\
                            for (var i in arguments) { args.push(arguments[i]); }\
                            return this[\'super\'].apply(this, args);\
                        ');

                        if (typeof gs.getter.meta !== 'undefined') {
                            gs.getter.meta.is_generated = true;
                            gs.getter.meta.is_inherited = true;

                            JOII.addFunctionToPrototype(prototype, gs.getter.meta, gs.getter.fn, true);

                            //prototype[gs.getter.name] = gs.getter.fn;
                            //prototype.__joii__.metadata[gs.getter.name] = gs.getter.meta;
                        }
                        if (typeof gs.setter.meta !== 'undefined') {
                            gs.setter.meta.is_generated = true;
                            gs.setter.meta.is_inherited = true;
                        
                            JOII.addFunctionToPrototype(prototype, gs.setter.meta, gs.setter.fn, true);

                            //prototype[gs.setter.name] = gs.setter.fn;
                            //prototype.__joii__.metadata[gs.setter.name] = gs.setter.meta;
                        }
                        
                    }
                    continue;
                }
            }

            // From this point on, the 'property' variable only contains
            // functions. This is where the funny business starts. Instead
            // of simply copying the 'function' into our own prototype,
            // we'll create our own function which calls the function from
            // the parent object. (Fixes issue #9)
            // The function "super" is implemented from the ClassBuilder.

            var generated_fn = null; 
            
            if (property_meta.is_static) {
                generated_fn = function (prop_name, parent_name) {
                    return function() {
                        return inner_static_objects[parent_name][prop_name].apply(inner_static_objects[parent_name], arguments);
                    };
                }(i, property_meta.class_name);
            } else {
                generated_fn = Function('\
                    var args = ["' + i + '"];\
                    for (var i in arguments) { args.push(arguments[i]); }\
                    return this[\'super\'].apply(this, args);\
                ');
            }
            
            var tmp_meta = JOII.Compat.extend(true, {}, property_meta);
            delete tmp_meta.overloads;

            tmp_meta.is_inherited = true;
            tmp_meta.has_parameterless = false;

            if (proto_meta.has_parameterless) {
                if (property_meta.is_final)
                {
                    throw 'Final member "' + property_meta.name + '(' + property_meta.parameters.join(', ') + ')" cannot be overwritten.';
                }
            } else {
                if (typeof (property) === 'function' || property_meta.parameters.length > 0 || 'overloads' in proto_meta || 'overloads' in property_meta) {
                    if ('overloads' in property_meta && typeof (property_meta.overloads) === 'object' && property_meta.overloads.length > 1) {

                        // parent has multiple overloads specified. Loop through them, and apply each.
                        for (var idx = 0; idx < property_meta.overloads.length; idx++) {
                            tmp_meta.parameters = property_meta.overloads[idx].parameters;
                            tmp_meta.is_abstract = property_meta.overloads[idx].is_abstract;
                            tmp_meta.has_parameters = property_meta.overloads[idx].has_parameters;
                            tmp_meta.is_final = property_meta.overloads[idx].is_final;
                            JOII.addFunctionToPrototype(prototype, tmp_meta, generated_fn, true);
                        }
                    } else {
                        JOII.addFunctionToPrototype(prototype, tmp_meta, generated_fn, true);
                    }

                } else {
                    prototype[i] = generated_fn;
                }
            }
        }
    }



    if (is_interface !== true) {
        /**
         * Calls a method from the parent prototype (if it exists).
         *
         * @param  {String} method
         * @return {*}
         */
        prototype['super'] = function(method) {
            var args = Array.prototype.slice.call(arguments, 1),
                current_scope = this,
                original_prop = this.__joii__,
                call          = function(scope, method, args) {
                    if (typeof (scope) === 'undefined') {
                        throw new Error('Parent method "' + method + '" does not exist.');
                    }
                    if (typeof (scope.__joii__.parent) !== 'undefined' &&
                        typeof (scope.__joii__.parent[method]) === 'undefined') {
                        return call(scope.__joii__.parent, method, args);
                    }

                    var parent = scope.__joii__.parent;
                    if (typeof (scope.__joii__.parent) === 'undefined') {
                        if (typeof (scope.__api__.__joii__.parent) !== 'undefined') {
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
         * @param  {String} name
         * @return {Boolean}
         */
        prototype.instanceOf = function(name) {

            // Find the JOII scope of the given object.
            if (typeof (name) === 'function') {
                name = name.prototype.__joii__.name;
            } else if (typeof (name) === 'object') {
                name = name.__joii__.name;
            }

            // Match against defined interfaces implemented in the class.
            var interfaces = this.__joii__.getInterfaces();
            for (var i in interfaces) {
                if (interfaces.hasOwnProperty(i) === false) continue;
                if (interfaces[i].prototype.__joii__.name === name) {
                    return true;
                }
                if (JOII.Compat.indexOf(interfaces[i].prototype.__joii__.implementations, name) !== -1) {
                    return true;
                }
            }
            if (this.__joii__.name !== name) {
                // Attempt to validate by parent.
                if (typeof (this.__joii__.parent) !== 'undefined') {
                    // Temporarily bind instanceOf to the parent scope.
                    var cur_scope = this;
                    var par_scope = this.__joii__.parent;
                    JOII.Compat.Bind(par_scope.instanceOf, par_scope);
                    var result = par_scope.instanceOf(name);
                    // Restore the scope and return the result.
                    JOII.Compat.Bind(par_scope.instanceOf, cur_scope);
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
 * @param  {String} str
 * @return {Object}
 */
JOII.ParseClassProperty = function(str, currently_defining) {
    // Parse the given string and set some defaults.
    var function_parameters = (/\(.*\)/).exec(str.toString());
    var has_parameters = false;
    if (function_parameters !== null) {
        has_parameters = true;
        function_parameters = function_parameters[0].match(/[^\(,\s\)]+/g);
    }
    if (typeof (function_parameters) != 'object' || function_parameters === null) {
        function_parameters = [];
    }

    var data = str.toString().replace(/\s?\(.*\)\s?|^\s+|\s+(?=\s)|\s+$/g, '').split(/\s/),
        name = data[data.length - 1],
        types = JOII.InternalTypeNames,
        explicit_serialize = false,
        metadata = {
            'name'          : name,
            'type'          : null,      // Allow all types by default.
            'visibility'    : 'public',  // Can be one of: public, protected, private.
            'is_abstract'   : false,     // Force implementation in child.
            'is_final'      : false,     // Disallow implementation in child.
            'is_nullable'   : false,     // Allow "null" or "undefined" in properties.
            'is_read_only'  : false,     // Don't generate a setter for the property.
            'is_constant'   : false,     // Is the property publicly accessible?
            'is_static'     : false,     // Is the property static?
            'is_enum'       : false,     // Is the property an enumerator?
            'is_generated'  : false,     // Is the property generated?
            'is_inherited'  : false,     // Is the property inherited?
            'is_joii_object': false,     // Does this represent a joii class/interface ?
            'serializable'  : false,     // Is the property serializable?
            'has_parameters': has_parameters,
            'parameters'    : function_parameters
        }, i;

    
    for (var c in JOII.Config.callables) {
        if (JOII.Config.callables[c] == name) {
            metadata.is_static = true;
        }
    }

    // Remove the name from the list.
    data.pop();

    // If there are no flags set, simply return the defaults.
    if (data.length === 0) {
        return metadata;
    }

    var raw_data = [];

    // Make sure all property flags are lowercase. We don't use Array.map
    // for this because Internet Explorer 8 (and below) doesn't know it.
    for (i in data) {
        if (typeof (JOII.InterfaceRegistry[data[i]]) === 'undefined' &&
            typeof (JOII.ClassRegistry[data[i]]) === 'undefined') {
            raw_data[i] = data[i].toString();
            data[i] = raw_data[i].toLowerCase();
        }
    }

    // Shorthand for validating other flags within the same declaration.
    // If args exists in data, msg is thrown.
    var metaHas = function(args, data, msg) {
        if (typeof (args) !== 'object') {
            args = [args];
        }

        for (var i in args) {
            if (args.hasOwnProperty(i) === false) continue;
            if (JOII.Compat.indexOf(data, args[i]) !== -1) {
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
                if (!explicit_serialize) {
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
            case 'static':
                metadata.is_static = true;
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
                if (JOII.Compat.indexOf(types, data[i]) !== -1) {
                    if (metadata.type !== null) {
                        throw 'Property "' + name + '" has multiple type defintions.';
                    }
                    metadata.type = data[i];
                    break;
                }
                // Check for Interface-types
                if (typeof (JOII.InterfaceRegistry[data[i]]) !== 'undefined') {
                    metadata.is_joii_object = true;
                    metadata.type = JOII.InterfaceRegistry[data[i]].definition.__interface__.name;
                    break;
                }
                // Check for Class-types
                if (typeof (JOII.ClassRegistry[data[i]]) !== 'undefined') {
                    metadata.is_joii_object = true;
                    metadata.type = JOII.ClassRegistry[data[i]].prototype.__joii__.name;
                    break;
                }
                // Check for enumerators
                if (typeof (JOII.EnumRegistry[data[i]]) !== 'undefined') {
                    metadata.is_enum = true;
                    metadata.type    = data[i];
                    break;
                }

                // Check for self reference (the class we're defining)
                if (currently_defining == raw_data[i]) {
                    metadata.is_joii_object = true;
                    metadata.type = data[i];
                    break;
                }

                throw 'Syntax error: unexpected "' + data[i] + '" in property declaration of "' + name + '".';
        }
    }

    return metadata;
};

JOII.CreatePropertyGetterSetter = function(deep_copy, meta, name) {
    "use strict";
    // If the meta type is boolean, prefix the getter with 'is'
    // rather than 'get'.
    var getter, getter_meta, getter_fn;
    if (meta.type === 'boolean') {
        if (JOII.CamelcaseName(meta.name).substr(0, 2) === 'Is') {
            getter = JOII.CamelcaseName(meta.name);
            getter = getter.substring(0, 1).toLowerCase() + getter.substring(1);
        } else {
            getter = 'is' + JOII.CamelcaseName(meta.name);
        }
    } else {
        getter = 'get' + JOII.CamelcaseName(meta.name);
    }
    var setter = 'set' + JOII.CamelcaseName(meta.name), setter_meta, setter_fn;

    // Create a getter
    if (typeof (deep_copy[getter]) === 'undefined') {
        
        if (meta.is_static) {
            getter_fn = function (name, prop_name) {
                return function () {
                    return inner_static_objects[name][prop_name];
                };
            }(name, meta.name);
        } else {
            getter_fn = new Function('return this["' + meta.name + '"];');
        }
        getter_meta = JOII.ParseClassProperty(meta.visibility + ' function ' + getter + '()', name);
        getter_meta.visibility = meta.visibility;
        getter_meta.is_abstract = meta.is_abstract;
        getter_meta.is_final = meta.is_final;
        getter_meta.is_static = meta.is_static;
        getter_meta.class_name = meta.class_name;
    }

    // Create a setter
    if (typeof (deep_copy[setter]) === 'undefined' && meta.is_read_only === false) {
        var nullable = meta.is_nullable, validator;
        
        if (meta.type !== null) {
            // InstanceOf validator (in case of interfaces & classes)
            if (typeof (JOII.InterfaceRegistry[meta.type]) !== 'undefined' ||
                typeof (JOII.ClassRegistry[meta.type]) !== 'undefined') {
                
                setter_fn = function (name, prop_name, prop_type, nullable, setter) {
                    return function (v) {
                        if (prop_type !== null) {
                            if (JOII.Compat.findJOIIName(v[0]) === prop_type) {} else {
                            if (v[0] !== null && typeof (v[0].instanceOf) !== 'function' || (typeof (v[0]) === 'object' && v[0] !== null && typeof (v[0].instanceOf) === 'function' && !v[0].instanceOf(prop_type)) || v[0] === null) {
                                if (nullable === false || (nullable === true && v[0] !== null && typeof (v[0]) !== "undefined")) {
                                    throw setter + ' expects an instance of ' + prop_type + ', ' + (v[0] === null ? "null" : typeof (v[0])) + " given.";
                                }
                            }};
                        }
                        this[prop_name] = v[0];
                        return this.__api__;
                    };
                }(name, meta.name, meta.type, nullable, setter);

            } else {
            
                // Native type validator
                setter_fn = function (name, prop_name, prop_type, nullable, setter) {
                    return function (v) {
                        if (prop_type !== null) {
                            if (typeof (JOII.EnumRegistry[prop_type]) !== 'undefined') {
                                var _e = JOII.EnumRegistry[prop_type];
                                if (!_e.contains(v[0])) {
                                    throw setter + ": '" + v[0] + "' is not a member of enum " + _e.getName() + ".";
                                }
                            } else {
                                if (typeof (v[0]) !== prop_type) {
                                    if (nullable === false || (nullable === true && v[0] !== null && typeof (v[0]) !== "undefined")) {
                                        throw setter + " expects " + prop_type + ", " + typeof (v[0]) + " given.";
                                    }
                                };
                            }
                        }
                        this[prop_name] = v[0];
                        return this.__api__;
                    };
                }(name, meta.name, meta.type, nullable, setter);
            }
        } else {
            setter_fn = function (prop_name) {
                return function (v) {
                    this[prop_name] = v[0];
                    return this.__api__;
                };
            }(meta.name);
        }

        // if it's static, make sure we're referring to it explicitly
        // so that we reference the same property, no matter which subclass it's called from
        // static properties stay with the class they're defined in.
        if (meta.is_static) {

            if (typeof (JOII.InterfaceRegistry[meta.type]) !== 'undefined' ||
                typeof (JOII.ClassRegistry[meta.type]) !== 'undefined') {
                
                setter_fn = function (name, prop_name, prop_type, nullable, setter) {
                    return function (v) {
                        if (prop_type !== null) {
                            if (JOII.Compat.findJOIIName(v[0]) === prop_type) {} else {
                            if (v[0] !== null && typeof (v[0].instanceOf) !== 'function' || (typeof (v[0]) === 'object' && v[0] !== null && typeof (v[0].instanceOf) === 'function' && !v[0].instanceOf(prop_type)) || v[0] === null) {
                                if (nullable === false || (nullable === true && v[0] !== null && typeof (v[0]) !== "undefined")) {
                                    throw setter + ' expects an instance of ' + prop_type + ', ' + (v[0] === null ? "null" : typeof (v[0])) + " given.";
                                }
                            }};
                        }
                        inner_static_objects[name][prop_name] = v[0];
                        return this.__api__;
                    };
                }(name, meta.name, meta.type, nullable, setter);
            } else {
                // Native type validator
                setter_fn = function (name, prop_name, prop_type, nullable, setter) {
                    return function (v) {
                        if (prop_type !== null) {
                            if (typeof (JOII.EnumRegistry[prop_type]) !== 'undefined') {
                                var _e = JOII.EnumRegistry[prop_type];
                                if (!_e.contains(v[0])) {
                                    throw setter + ": '" + v[0] + "' is not a member of enum " + _e.getName() + ".";
                                }
                            } else {
                                if (typeof (v[0]) !== prop_type) {
                                    if (nullable === false || (nullable === true && v[0] !== null && typeof (v[0]) !== "undefined")) {
                                        throw setter + " expects " + prop_type + ", " + typeof (v[0]) + " given.";
                                    }
                                };
                            }
                        }
                        inner_static_objects[name][prop_name] = v[0];
                        return this.__api__;
                    };
                }(name, meta.name, meta.type, nullable, setter);
                
            }

        }
        // we want to take in ANY type, so we can provide better feedback with our setter function
        setter_meta = JOII.ParseClassProperty(meta.visibility + ' function ' + setter + '(...)', name);
        setter_meta.visibility = meta.visibility;
        setter_meta.is_abstract = meta.is_abstract;
        setter_meta.is_final = meta.is_final;
        setter_meta.is_static = meta.is_static;
        setter_meta.class_name = meta.class_name;
    }

    return {
        'getter' : { name: getter, fn: getter_fn, meta: getter_meta },
        'setter' : { name: setter, fn: setter_fn, meta: setter_meta }
    };
};

/**
 * Creates a non-enumerable property in the given object.
 *
 * If the browser doesn't support Object.defineProperty, a regular
 * property is created instead. Please be aware that unit-tests using
 * deepEqual-assertions might fail on this using older browsers.
 *
 * @param {Object}  obj
 * @param {String}  name
 * @param {*}       val
 * @param {Boolean} writable
 */
JOII.CreateProperty = function(obj, name, val, writable) {
    try {
        if (typeof (Object.defineProperty) !== 'undefined') {
            Object.defineProperty(obj, name, {
                value        : val,
                enumerable   : (writable === false),
                configurable : (writable !== false),
                writable     : (writable !== false)
            });
        } else {
            obj[name] = val;
        }
    } catch (e) {
        obj[name] = val;
    }
};



/**
 * Adds a function to the prototype. 
 *
 * Meta.parameters should include the types in order to support overloading.
 *
 * @param {Object}   prototype
 * @param {Object}   meta
 * @param {Function} fn
 * @param {Boolean}  ignore_duplicate
 */
JOII.addFunctionToPrototype = function(prototype, meta, fn, ignore_duplicate) {

    if (meta.is_abstract && meta.is_final) {
        throw 'Member "' + meta.name + '(' + meta.parameters.join(', ') + ')" cannot be both abstract and final simultaniously.';
    }

    if (typeof (ignore_duplicate) === 'undefined') {
        ignore_duplicate = false;
    }
    if (typeof (prototype.__joii__.metadata[meta.name]) !== 'object') {
        prototype.__joii__.metadata[meta.name] = JOII.Compat.extend(true, {}, meta);
        prototype.__joii__.metadata[meta.name].overloads = [];
    }

    var proto_meta = prototype.__joii__.metadata[meta.name];

    if (typeof (proto_meta.overloads) !== 'object') {
        proto_meta.overloads = [];
    }

    if (proto_meta.visibility !== meta.visibility) {
        throw 'Member ' + meta.name + ': inconsistent visibility.';
    }
    
    var has_parameterless = proto_meta.has_parameterless;
    

    proto_meta.is_abstract = false;
    proto_meta.is_final = false;
    proto_meta.has_parameterless = false;

    for (var i = 0; i < meta.parameters.length - 1; i++) {
        if (meta.parameters[i] == '...') {
            throw 'Member ' + meta.name + ': Variadic parameter (...) must be the last in the function parameter list.';
        }
    }

    var not_all_overloads_final = !meta.is_final;
    var first_loop = true;

    for (var idx = 0; idx < proto_meta.overloads.length; idx++) {
        var function_parameters_meta = proto_meta.overloads[idx];
        
        var found_abstract_this_loop = false;
        if (function_parameters_meta.is_abstract) {
            found_abstract_this_loop = true;
        }
        if (!function_parameters_meta.has_parameters) {
            proto_meta.has_parameterless = true;
        }

        not_all_overloads_final = not_all_overloads_final || (!function_parameters_meta.is_final);

        if (function_parameters_meta.parameters.length === meta.parameters.length) {
            // this signature has the same number of types as the new signature
            // check to see if the types are the same (duplicate signature)
            var different = false;

            for (var j = 0; j < function_parameters_meta.parameters.length; j++) {
                if (function_parameters_meta.parameters[j] != meta.parameters[j]) {
                    different = true;
                }
            }
            if (!different) {
                if (function_parameters_meta.is_abstract) {
                    proto_meta.overloads.splice(idx, 1); // remove the abstract version, since we're about to add a non-abstract
                    idx--; // adjust the idx for the changed array
                    found_abstract_this_loop = false; // we're removing this, so don't count it for abstract check
                } else if (meta.is_final) {
                    throw 'Final member "' + meta.name + '(' + meta.parameters.join(', ') + ')" cannot be overwritten.';
                } else {
                    if (!ignore_duplicate) {
                        throw 'Member "' + meta.name + '(' + meta.parameters.join(', ') + ')" is defined twice.';
                    } else {
                        return false;
                    }
                }
            }
        }

        if (found_abstract_this_loop) {
            proto_meta.is_abstract = true;
        }
    }
    
    var function_meta = {
        fn: fn,
        parameters      : meta.parameters,
        is_abstract     : meta.is_abstract,
        is_final        : meta.is_final,
        is_inherited    : meta.is_inherited,
        has_parameters  : meta.has_parameters
    };

    if (!meta.has_parameters) {
        proto_meta.has_parameterless = true;
    }

    prototype.__joii__.metadata[meta.name].overloads.push(function_meta);

    if (function_meta.is_abstract) {
        prototype.__joii__.metadata[meta.name].is_abstract = true;
    }

    prototype.__joii__.metadata[meta.name].is_final = !not_all_overloads_final;

    // create function shim to validate the parameters, and allow overloading
    //if (typeof (prototype[meta.name]) !== 'function') { // this test was preventing it from overriding toString
    prototype[meta.name] = JOII.createFunctionShim(meta.name, prototype.__joii__.metadata[meta.name].overloads);
    //}

    return true;
};


/**
 * Creates a function detour which checks type parameters, then dispatches to the appropriate overloaded function.
 *
 * @param {String}   name
 * @param {Object}   overloads
 */
JOII.createFunctionShim = function(name, overloads) {

    return function() {

        // If there's only one function, and it has no parameters, we'll assume it's old-style to preserve backwards compatibility, so just pass the list of parameters
        if (overloads.length === 1 && overloads[0].parameters.length === 0) {
            return overloads[0].fn.apply(this, arguments);
        }
        
        var closest_variadic = null;
        var closest_variadic_parameter_count = -1;
        var parameterless = null;

        for (var overload_index = 0; overload_index < overloads.length; overload_index++) {
            var func = overloads[overload_index];
            var parameters = func.parameters;

            var valid = true;

            if (!func.has_parameters) {
                parameterless = func;
            }

            // test exact matches
            if (parameters.length == arguments.length) {
                for (var i = 0; i < parameters.length; i++) {

                    if (!JOII.Compat.canTypeBeCastTo(arguments[i], parameters[i])) {
                        valid = false;
                        break;
                    }
                }

                if (valid) {
                    // found an overload that matches the inputs - call it
                    return func.fn.apply(this, arguments);
                }
            }

            if (parameters[parameters.length - 1] == '...') {
                // test for variadic
                valid = null;
                var variadic_parameter_count = 0;
                for (var i = 0; i < parameters.length; i++) {

                    if (parameters[i] === '...') {
                        valid = true;
                    } else {
                        if (!JOII.Compat.canTypeBeCastTo(arguments[i], parameters[i])) {
                            valid = false;
                            break;
                        }
                        variadic_parameter_count++;
                    }
                }

                if (valid) {

                    if (variadic_parameter_count > closest_variadic_parameter_count) {
                        closest_variadic = func;
                        closest_variadic_parameter_count = variadic_parameter_count;
                    }
                }
            }
        }

        if (closest_variadic != null) {

            if (!func.is_inherited)
            {
                // extract the variadic portion of the call to an array
                var args = []; // arguments.splice(closestVariadic.parameters.length -1);

                for (var i = closest_variadic.parameters.length - 1; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }

                arguments.length = closest_variadic.parameters.length;

                arguments[closest_variadic.parameters.length - 1] = args;
            }

            // found an overload that matches the inputs - call it
            return closest_variadic.fn.apply(this, arguments);
        }

        if (parameterless != null) {
            // found an old-style parameterless function. Use it for the "catch all"
            return parameterless.fn.apply(this, arguments);
        }

        // create a type list of the arguments for error handling purposes
        var parameter_types = [];
        for (var i = 0; i < arguments.length; i++) {
            var JOIIName = JOII.Compat.findJOIIName(arguments[i]);
            if (!JOIIName) {
                JOIIName = typeof (arguments[i]);
            }
            parameter_types.push(JOIIName === null ? typeof (arguments[i]) : JOIIName);
        }

        throw 'Couldn\'t find a function handler to match: ' + name + '(' + parameter_types.join(', ') + ').';
    };
};


/**
 * Camelcase a name.
 *
 * @param  {String} input
 * @return {String}
 */
JOII.CamelcaseName = function(input) {
    input = input.toLowerCase().replace(/_(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
    return input.charAt(0).toUpperCase() + input.slice(1);
};
/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/

'use strict';

    JOII = typeof (JOII) !== 'undefined' ? JOII : {};
    JOII.ClassRegistry = {};

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
    JOII.ClassBuilder = function() {
        var args                        = JOII.Compat.ParseArguments(arguments),
            name                        = args.name,
            parameters                  = args.parameters,
            body                        = args.body,
            is_static_generated         = args.is_static_generated === true;
        
        function static_scope_in() {
            // If 'this.__joii__' is not available, that would indicate that
            // we've been executed like a function rather than being instantiated.
            if (typeof (this) === 'undefined' || typeof (this.__joii__) === 'undefined') {
                // If the method __call exists, execute it and return its result.

                return definition.apply(undefined, arguments);
            }

            return new definition();
        }
        /**
         * Defines the class definition. This is the function that is executed
         * when the class is instantiated or executed. The function will relay
         * execution to the __construct or __call method, depending whether the
         * class was called as a function or instantiated using the 'new'
         * keyword.
         *
         * @return object The outer (public) class scope.
         */
        function definition() {

            var func_in         = function() { };
            func_in.prototype   = this;
            var scope_in_obj    = new func_in();
            

            // Create an inner and outer scope. The inner scope refers to the
            // 'this' variable, where the outer scope contains references to
            // all objects and functions accessible from the outside.
            var scope_in = generateInnerScope(this, arguments, scope_in_obj, false);
            
            // for __call implementations
            if (typeof (this) === 'undefined' || typeof (this.__joii__) === 'undefined' || typeof (scope_in) !== 'object' || typeof (scope_in.__joii__) === 'undefined') {
                return scope_in;
            }
            
            var scope_out = generateOuterScope(this, scope_in);
            
            // need to link the inner and outer scopes before calling constructors
            linkAPI(scope_in, scope_out);

            callConstructors(scope_in, arguments);

            return scope_out;
        }

        function callConstructors(scope_in, args)
        {
            // Does the class defintion have a constructor? If so, run it.
            for (var c in JOII.Config.constructors) {
                if (JOII.Config.constructors.hasOwnProperty(c)) {
                    var cc = JOII.Config.constructors[c];
                    if (typeof (scope_in[cc]) === 'function') {
                        scope_in[cc].apply(scope_in, args);
                        break;
                    }
                }
            }
            
            // deserialize data
            if (args.length == 1 && typeof args[0] == 'object' && '__joii_deserialize_object' in args[0]) {
                scope_in.deserialize(args[0].data);
            }
        }

        function linkAPI(scope_in, scope_out)
        {
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
        }

        function generateInnerScope(scope, args, base_object, is_static_generated) {
            var scope_in = base_object || {};

            is_static_generated = is_static_generated || false;

            // Create a deep copy of the inner scope because we need to
            // dereference object-type properties. If we don't do this, object-
            // types are treated statically throughout all instances.
            scope_in = JOII.Compat.extend(true, {}, scope_in);

            if (typeof scope !== 'undefined') {
                JOII.CreateProperty(scope_in, '__joii__', (scope.__joii__));
            }

            if (typeof scope !== 'undefined' && typeof (scope_in.__joii__) === 'object') {
                // Can we be instantiated?
                if (scope_in.__joii__.is_abstract === true) {
                    throw 'An abstract class cannot be instantiated.';
                }
                if (!is_static_generated && scope_in.__joii__.is_static === true) {
                    throw 'A static class cannot be instantiated.';
                }
            }

            // If 'this.__joii__' is not available, that would indicate that
            // we've been executed like a function rather than being instantiated.
            if (typeof (scope) === 'undefined' || typeof (scope.__joii__) === 'undefined') {
                // If the method __call exists, execute it and return its result.

                if (typeof (static_scope_in) !== 'undefined')
                {
                    for (var c in JOII.Config.callables) {
                        if (JOII.Config.callables.hasOwnProperty(c)) {
                            if (typeof (static_scope_in[JOII.Config.callables[c]]) === 'function') {
                                var result = static_scope_in[JOII.Config.callables[c]].apply(body, args);
                                if (result === body) {
                                    throw JOII.Config.callables[c] + ' cannot return itself.';
                                }
                                return result;
                            }
                        }
                    }
                }
                throw 'This class cannot be called as a function because it\'s lacking the __call method.';
            }



            // Are we attempting to instantiate an abstract class?
            if (scope.__joii__.is_abstract) {
                throw 'Cannot instantiate abstract class ' + scope.__joii__.name;
            }


            return scope_in;

        }

        function generateOuterScope(scope, scope_in, base_object) {
            var scope_out = base_object || {};
            
            if (typeof scope !== 'undefined' && typeof (scope.__joii__) === 'object') {
                
                JOII.CreateProperty(scope_out, '__joii__', (scope.__joii__));
            
                // Can we be instantiated?
                if (scope_out.__joii__.is_abstract === true) {
                    throw 'An abstract class cannot be instantiated.';
                }

                // The outside scope.
                for (var i in scope) {
                    var meta = scope_in.__joii__.metadata[i];

                    if (meta && 'overloads' in meta) {
                        for (var fn_meta in meta.overloads) {
                            // Test missing abstract implementations...
                            if (meta.overloads[fn_meta] && meta.overloads[fn_meta].is_abstract === true) {
                                throw 'Missing abstract member implementation of ' + i + '(' + meta.overloads[fn_meta].parameters.join(', ') + ')';
                            }
                        }
                    } else if (meta && meta.is_abstract === true) {
                        throw 'Missing abstract member implementation of "' + i + '".';
                    }
                }
            }

            bindPublicMethods(scope_in, scope_out);

            return scope_out;
        }

        function bindPublicMethods(from_obj, to_obj)
        {
            // The outside scope.
            for (var i in from_obj) {
                var meta = from_obj.__joii__.metadata[i];
                
                // Only allow public functions in the outside scope.
                if (typeof (from_obj[i]) === 'function' && (typeof (meta) === 'undefined' || meta.visibility === 'public') && (i !== '__call')) {
                    to_obj[i] = JOII.Compat.Bind(from_obj[i], from_obj);
                }
            }
        }


        if (typeof (body) == 'function') {
            body = body(static_scope_in);
        }
        
        if (typeof (body) != 'object') {
            throw 'Invalid parameter types given. Expected: ([[[string], object], <object|function>]).';
        }

        

        // Apply to prototype to the instantiator to allow extending the
        // class definition upon other definitions without instantiation.
        definition.prototype = JOII.PrototypeBuilder(name, parameters, body, false, is_static_generated);
        


        // Apply constants to the definition
        for (var i in definition.prototype.__joii__.constants) {
            JOII.CreateProperty(definition, i, definition.prototype.__joii__.constants[i], false);
        }

        // Does the class implement an enumerator?
        if (typeof (parameters['enum']) === 'string') {
            var e = JOII.EnumBuilder(parameters['enum'], definition);
            if (parameters.expose_enum === true) {
                var g = typeof window === 'object' ? window : global;
                if (typeof (g[parameters['enum']]) !== 'undefined') {
                    throw 'Cannot expose Enum "' + parameters['enum'] + '" becase it already exists in the global scope.';
                }
                g[parameters['enum']] = e;
            }
        }

        // Override toString to return a class symbol.
        var n = arguments[0];
        definition.toString = function() {
            if (typeof (n) === 'string') {
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
        bindGetInterfaces(definition.prototype.__joii__);


        function bindGetInterfaces(joii)
        {
            
            // Recursive function for retrieving a list of interfaces from the
            // current class and the rest of the inheritance tree.
            joii.getInterfaces = JOII.Compat.Bind(function() {
                var interfaces = [],
                    getRealInterface = JOII.Compat.Bind(function(i) {
                        if (typeof (i) === 'function') {
                            return i;
                        } else if (typeof (i) === 'string') {
                            if (typeof (JOII.InterfaceRegistry[i]) === 'undefined') {
                                throw 'Interface "' + i + '" does not exist.';
                            }
                            return JOII.InterfaceRegistry[i];
                        }
                    }, this);

                // Fetch interfaces from the parent list - if they exist.
                if (typeof (this.parent) !== 'undefined' && typeof (this.parent.__joii__) !== 'undefined') {
                    interfaces = this.parent.__joii__.getInterfaces();
                }

                if (typeof (this.interfaces) !== 'undefined') {
                    if (typeof (this.interfaces) === 'object') {
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
            }, joii);
        }

        // If any interfaces are implemented in this class, validate them
        // immediately rather than doing so during instantiation. If the
        // class is declared abstract, the validation is skipped.
        if (parameters.abstract !== true) {
            var interfaces = definition.prototype.__joii__.getInterfaces();
            for (var ii in interfaces) {
                if (interfaces.hasOwnProperty(ii) && typeof (interfaces[ii]) === 'function') {
                    interfaces[ii](definition);
                }
            }
        }

        
        if (parameters['static'] !== true && !is_static_generated) {

            // check to make sure serialize doesn't exist yet, or if it does - it's capable of being overloaded without breaking BC
            if ((!('serialize' in definition.prototype.__joii__.metadata)) || (('overloads' in definition.prototype.__joii__.metadata['serialize']) && (definition.prototype.__joii__.metadata['serialize']['overloads'][0].parameters.length > 0 || definition.prototype.__joii__.metadata['serialize']['overloads'].length > 1))) {

                /**
                 * Serializes all serializable properties of an object. Public members are serializable by default.
                 *
                 * @return {String}
                 */
                var generated_fn = function(json) {
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
                // uses an inheritance style add, so it won't overwrite custom functions with the same signature
                var serialize_meta = JOII.ParseClassProperty('public function serialize()');
                JOII.addFunctionToPrototype(definition.prototype, serialize_meta, generated_fn, true);
            }



            // check to make sure deserialize doesn't exist yet, or if it does - it's capable of being overloaded without breaking BC
            if ((!('deserialize' in definition.prototype.__joii__.metadata)) || (('overloads' in definition.prototype.__joii__.metadata['deserialize']) && (definition.prototype.__joii__.metadata['deserialize']['overloads'][0].parameters.length > 0 || definition.prototype.__joii__.metadata['deserialize']['overloads'].length > 1))) {
                /**
                 * Deserializes a class (called on an object instance to populate it)
                 *
                 * @param {String}
                 */
                var generated_fn = function(json) {
                    this.deserialize(JSON.parse(json));
                };
                // uses an inheritance style add, so it won't overwrite custom functions with the same signature
                var deserialize_meta = JOII.ParseClassProperty('public function deserialize(string)');
                JOII.addFunctionToPrototype(definition.prototype, deserialize_meta, generated_fn, true);

                /**
                 * Deserializes a class (called on an object instance to populate it)
                 *
                 * @param {Object}
                 */
                generated_fn = function(obj) {
                    for (var key in (this.__joii__.metadata)) {
                        var val = this.__joii__.metadata[key];

                        if (val.serializable) {
                            if (val.name in obj && typeof obj[val.name] != 'function') {
                                if (typeof obj[val.name] == 'object' && obj[val.name] != null && '__joii_type' in (obj[val.name])) {
                                    var name = obj[val.name].__joii_type;
                                    // Check for Interface-types
                                    if (typeof (JOII.InterfaceRegistry[name]) !== 'undefined') {
                                        throw 'Cannot instantiate an interface.';
                                    }
                                    // Check for Class-types
                                    else if (typeof (JOII.ClassRegistry[name]) !== 'undefined') {
                                        this[val.name] = JOII.ClassRegistry[name].deserialize(obj[val.name]);
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
                // uses an inheritance style add, so it won't overwrite custom functions with the same signature
                deserialize_meta = JOII.ParseClassProperty('public function deserialize(object)');
                JOII.addFunctionToPrototype(definition.prototype, deserialize_meta, generated_fn, true);

            };

        }



        
        // if it's not a static class, generate it's static backing field
        if (!is_static_generated && typeof (parameters['enum']) !== 'string') {
            
            var __in_joii_static_class_constructor = false;

            function staticDefinition() {

                var func_in         = function() { };
                func_in.prototype   = this;
                var scope_in_obj    = new func_in();

                static_scope_in.prototype = definition;

                // Create an inner static scope, for private/protected members                
                var scope_in = generateInnerScope(this, [], scope_in_obj, true);
            
                // Create the static field, and copy it into the object we created before.
                // Need to copy it this way, so that the object reference is still the same, 
                // since we may have passed it into the optional user function which generates the body
                static_scope_in = JOII.Compat.extend(true, static_scope_in, scope_in);
                
                // bind any public static members to the outside class
                //bindPublicMethods(static_scope_in, definition);

                definition = generateOuterScope(static_scope_in, static_scope_in, definition);
                
                // need to link the inner and outer scopes before calling constructors
                linkAPI(static_scope_in, definition);
                
                // static constructors can't have parameters
                callConstructors(static_scope_in, []);
                
                return static_scope_in;
            }
            
            __in_joii_static_class_constructor = true;

            // Apply to prototype to the instantiator to allow extending the
            // class definition upon other definitions without instantiation.
            staticDefinition.prototype = JOII.PrototypeBuilder(name, parameters, body, false, true);
            
            // Store defined interfaces in the metadata.
            staticDefinition.prototype.__joii__.interfaces = parameters['implements'];

            bindGetInterfaces(staticDefinition.prototype.__joii__);
            
            // If any interfaces are implemented in this class, validate them
            // immediately rather than doing so during instantiation. If the
            // class is declared abstract, the validation is skipped.
            if (parameters.abstract !== true) {
                var interfaces = staticDefinition.prototype.__joii__.getInterfaces();
                for (var ii in interfaces) {
                    if (interfaces.hasOwnProperty(ii) && typeof (interfaces[ii]) === 'function') {
                        interfaces[ii](staticDefinition);
                    }
                }
            }

            /**
             * Deserializes a class (called as a static method - instantiates a new object and populates it)
             *
             * @param {String}
             */
            var generated_fn = function(json) {
                return this.deserialize(JSON.parse(json));
            };
            // uses an inheritance style add, so it won't overwrite custom functions with the same signature
            var deserialize_meta = JOII.ParseClassProperty('public static function deserialize(string)');
            JOII.addFunctionToPrototype(staticDefinition.prototype, deserialize_meta, generated_fn, true);

            
            /**
             * Deserializes a class (called as a static method - instantiates a new object and populates it)
             *
             * @param {Object}
             */
            generated_fn = function(obj) {
                var deserialize_object = {
                    '__joii_deserialize_object': true,
                    'data': obj
                };
                return new definition(deserialize_object);
            };
            // uses an inheritance style add, so it won't overwrite custom functions with the same signature
            deserialize_meta = JOII.ParseClassProperty('public static function deserialize(object)');
            JOII.addFunctionToPrototype(staticDefinition.prototype, deserialize_meta, generated_fn, true);


            /**
             * Gets the current static scope
             *
             * @param {String}
             */
            /*
            var generated_fn = function() {
                return static_scope_in;
            };
            // uses an inheritance style add, so it won't overwrite custom functions with the same signature
            var deserialize_meta = JOII.ParseClassProperty('private function getStatic()');
            JOII.addFunctionToPrototype(definition.prototype, deserialize_meta, generated_fn, true);
            */

            // create an object for the static members, and store a reference to it
            inner_static_objects[name] = new staticDefinition();
            
            
            definition.__joii__.prototype = staticDefinition.prototype;
            

        }


        
        
        // Register the class by the given name to make it usable as a type
        // inside property declarations.
        if (typeof (JOII.ClassRegistry[name]) !== 'undefined') {
            throw 'Another class named "' + name + '" already exists.';
        }
        JOII.ClassRegistry[name] = definition;



        definition.prototype = JOII.Compat.extend(true, {}, definition.prototype);

        return definition;
    };
/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/

JOII = typeof (JOII) !== 'undefined' ? JOII : {};
JOII.InterfaceRegistry = {};

/**
 * Builds an interface for a class to enforce implementation and signature
 * of a set of properties and methods.
 *
 * @return {Object}
 */
JOII.InterfaceBuilder = function() {

    var args        = JOII.Compat.ParseArguments(arguments),
        name        = args.name,
        parameters  = args.parameters,
        body        = args.body;

    // Start by creating a prototype based on the parameters and body.
    // The definition will be the resulting function containing all
    // required information about this interface.
    var prototype  = JOII.PrototypeBuilder(name, parameters, body, true),
        definition = function(prototype) {
            var reflector = new JOII.Reflection.Class(prototype),
                properties = this.reflector.getProperties(),
                methods = this.reflector.getMethods(),
                i, p1, p2;

            // If the class is marked as 'abstract', running interface validation
            // on it is rather useless since the class can't be instantiated.
            if (reflector.isAbstract()) {
                return true;
            }

            var verifyMeta = function(t, p1, p2, prefix) {
                if (p1.getVisibility() !== p2.getVisibility()) {
                    throw prefix + ' ' + p2.getName() + ' cannot be ' + p2.getVisibility() + ' because the interface declared it ' + p1.getVisibility() + '.';
                }
                if (prefix != 'Method') {
                    if (p1.getType() !== p2.getType()) {
                        throw prefix + ' ' + p2.getName() + ' cannot be declared as ' + p2.getType() + ' because the interface declared it as ' + p1.getType() + '.';
                    }
                    if (p1.isNullable() !== p2.isNullable()) {
                        throw prefix + ' ' + p2.getName() + ' must be nullable as defined in the interface ' + t.name + '.';
                    }
                }
                return true;
            };


            // Verify that all properties exist and have the correct metadata.
            for (i in properties) {
                if (properties.hasOwnProperty(i) === false) continue;
                p1 = properties[i];
                
                if (p1.isStatic() && !reflector.isStatic()) continue;
                if (!p1.isStatic() && reflector.isStatic()) continue;


                if (!reflector.hasProperty(p1.getName())) {
                    throw 'Class must implement ' + (p1.toString().split(':')[0]) + ' as defined in the interface ' + this.name + '.';
                }
                p2 = reflector.getProperty(p1.getName());

                // Verify meta data
                verifyMeta(this, p1, p2, 'Property');
            }

            // Verify methods.
            for (i in methods) {
                if (methods.hasOwnProperty(i) === false) continue;
                p1 = methods[i];

                if (p1.isStatic() && !reflector.isStatic()) continue;
                if (!p1.isStatic() && reflector.isStatic()) continue;

                if (!reflector.hasMethod(p1.getName())) {
                    throw 'Class must implement ' + (p1.toString().split(':')[0]) + ' as defined in the interface ' + this.name + '.';
                }
                p2 = reflector.getMethod(p1.getName());

                // Verify meta data
                verifyMeta(this, p1, p2, 'Method');

                // Verify function signature.
                var args_interface = p1.getParameters();
                var args_class = p2.getParameters();

                if (args_interface.length == 0 || typeof (args_interface[0]) !== 'object') {
                    // fallback for backwards compatibility
                    if (args_interface.length !== args_class.length) {
                        throw 'Method ' + p1.getName() + ' does not match the parameter count as defined in the interface ' + this.name + '.';
                    }
                } else {
                    for (var idx = 0; idx < args_interface.length; idx++) {
                        var interface_parameters_meta = args_interface[idx];

                        var different = true;

                        for (var x = 0; x < args_class.length; x++) {
                            var class_parameters_meta = args_class[x];

                            if (interface_parameters_meta.length === class_parameters_meta.length) {
                                // this signature has the same number of types as the new signature
                                // check to see if the types are the same (duplicate signature)
                                different = false;

                                for (var y = 0; y < interface_parameters_meta.length; y++) {
                                    if (interface_parameters_meta[y].type != class_parameters_meta[y].type) {
                                        different = true;
                                    }
                                }
                                if (!different) {
                                    break;
                                }
                            }
                        }
                        if (different) {
                            throw 'Method ' + p1.getName() + ' does not match the parameter types as defined in the interface ' + this.name + '.';
                        }
                    }
                }
            }
        };

    // Set our interface specification
    JOII.CreateProperty(definition, '__interface__', {
        prototype : prototype,
        reflector : new JOII.Reflection.Class(prototype),
        name      : name
    });

    // And the standard JOII-metadata.
    JOII.CreateProperty(definition, '__joii__', prototype.__joii__);

    var constructor = JOII.Compat.Bind(definition, definition.__interface__);
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
        if (properties.hasOwnProperty(i) === false) continue;
        validate(properties[i], 'Property');
    }
    for (i in methods) {
        if (methods.hasOwnProperty(i) === false) continue;
        validate(methods[i], 'Method');
    }

    // Apply the definition to the constructor to have access to metadata
    // without running or instantiating the function.
    JOII.CreateProperty(constructor, 'definition', definition);

    // Register the interface, making it available in the PrototypeBuilder
    // to use as a type in property definitions.
    if (typeof (JOII.InterfaceRegistry[name]) !== 'undefined') {
        throw 'Another interface with the name "' + name + '" already exists.';
    }
    if (JOII.Compat.indexOf(JOII.InternalTypeNames, name) !== -1) {
        throw 'An interface may not be named "' + name + '", becase that name is reserved.';
    }

    // Apply constants to the definition
    var constants = {};
    for (i in prototype.__joii__.constants) {
        if (prototype.__joii__.constants.hasOwnProperty(i) === false) continue;
        JOII.CreateProperty(constructor, i, prototype.__joii__.constants[i], false);
        constants[i] = prototype.__joii__.constants[i];
    }

    // Does the class implement an enumerator?
    if (typeof (parameters['enum']) === 'string') {
        var e = JOII.EnumBuilder(parameters['enum'], constants);
        if (parameters.expose_enum === true) {
            var g = typeof window === 'object' ? window : global;
            if (typeof (g[parameters['enum']]) !== 'undefined') {
                throw 'Cannot expose Enum "' + parameters['enum'] + '" becase it already exists in the global scope.';
            }
            g[parameters['enum']] = e;
        }
    }
    JOII.InterfaceRegistry[name] = constructor;

    return constructor;
};
/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/

JOII = typeof (JOII) !== 'undefined' ? JOII : {};
JOII.EnumRegistry = {};

/**
 * An enumerator can be used for type checking to validate if the given
 * value exists within the object as a constant value.
 */
JOII.EnumBuilder = JOII.ClassBuilder({ 'final' : true }, {

    'public immutable string name'      : null,
    'public immutable object constants' : {},

    /**
     * @param {String} name
     * @param {Object} obj
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
     * @param  {*} value
     * @return bool
     */
    contains: function(value)
    {
        for (var i in this.constants) {
            if (this.constants.hasOwnProperty(i) === false) continue;
            if (this.constants[i] === value) {
                return true;
            }
        }
        return false;
    },

    /**
     * Registers a new Enumerator type with the given name and object.
     *
     * @param  {String} name
     * @param  {Object} obj
     * @return JOII.EnumBuilder
     */
    __call: function(name, obj) {
        if (typeof (name) !== 'string') {
            throw 'Argument #1 of Enum must be a string, ' + typeof (name) + ' given.';
        }
        if (typeof (obj) === 'function' &&
            typeof (obj.prototype.__joii__) !== 'undefined') {
            obj = obj.prototype.__joii__.constants;
        }

        if (typeof (obj) !== 'object') {
            throw 'Argument #2 of Enum must be an object or definition, ' + typeof (obj) + ' given.';
        }

        if (typeof (JOII.EnumRegistry[name.toLowerCase()]) !== 'undefined') {
            throw 'Enumerator "' + name + '" already exists.';
        }

        var enumerator = new JOII.EnumBuilder(name, obj);
        for (var i in obj) {
            if (typeof (obj[i]) === 'function') {
                throw 'An enumerator cannot contain functions. "' + i + '" is a function.';
            }
            if (typeof (obj[i]) === 'object') {
                throw 'An enumerator cannot contain objects. "' + i + '" is an object.';
            }
            JOII.CreateProperty(enumerator, i, obj[i], false);
        }
        JOII.EnumRegistry[name.toLowerCase()] = enumerator;
        return enumerator;
    }
});
/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/

// Register JOII 'namespace'.
JOII = typeof (JOII) !== 'undefined' ? JOII : {};
JOII.Reflection = {};

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
JOII.Reflection.Class = JOII.ClassBuilder({}, {

    /**
     * Contains the __joii__ metadata object.
     *
     * @var object
     */
    'protected immutable object meta': null,

    /**
     * Contains the prototype of the class.
     *
     * @var object
     */
    'protected immutable object proto': null,

    /**
     * Represents the Reflection.Class instance of the parent definition.
     *
     * @var JOII.Reflection.Class
     */
    'public immutable object parent': null,

    /**
     * Constructor
     *
     * @param {Function} definition
     */
    'protected __construct': function(definition) {

        if (typeof (definition) === 'function') {
            definition = definition.prototype;
        }

        // Is the passed argument an actual JOII class?
        if (typeof (definition) !== 'object' ||
            typeof (definition.__joii__) !== 'object') {
            throw 'Reflection.Class requires a JOII-created definition.';
        }

        this.proto = definition;
        this.meta = definition.__joii__;

        // Does the class definition have a parent?
        if (typeof (this.meta.parent) !== 'undefined') {
            this.parent = new JOII.Reflection.Class(this.meta.parent);
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
     * Returns true if the property is static.
     *
     * @return bool
     */
    'public isStatic': function() {
        return this.meta.is_static;
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
            if (typeof (this.proto[i]) === 'function' && JOII.Compat.indexOf(JOII.InternalPropertyNames, i) === -1) {
                result.push(new JOII.Reflection.Method(this, i));
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
    'public getMethod': function(name) {
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
    'public getProperties': function(filter) {
        var result = [];
        for (var i in this.proto) {
            if (typeof (this.proto[i]) !== 'function' && JOII.Compat.indexOf(JOII.InternalPropertyNames, i) === -1) {
                result.push(new JOII.Reflection.Property(this, i));
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
    'public getProperty': function(name) {
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
JOII.Reflection.Property = JOII.ClassBuilder({}, {

    /**
     * Represents the reflector of the owning class.
     *
     * @var JOII.Reflection.Class
     */
    'protected nullable object reflector': null,

    /**
     * Represents the metadata of this property.
     *
     * @var object
     */
    'protected nullable object meta': null,

    /**
     * Represents the name of the property.
     *
     * @var string
     */
    'public read string name': null,

    /**
     * Constructor.
     *
     * @param JOII.Reflection.Class reflector
     * @param string property_name
     */
    'protected __construct': function(reflector, property_name) {
        this.reflector = reflector;
        this.name = property_name;
        this.meta = reflector.getMeta().metadata[property_name];

        // If we, for some strange reason don't have metadata, fill it in
        // with some default values.
        if (typeof (this.meta) === 'undefined') {
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
            this.meta.type = typeof (this.reflector.getProto()[this.meta.name]);
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
     * Returns true if the property is static.
     *
     * @return bool
     */
    'public isStatic': function() {
        return this.meta.is_static;
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
        
        if (this.meta.is_static) { name_parts.push('static'); }

        if (this.meta.is_nullable) { name_parts.push('nullable'); }
        if (this.meta.is_read_only) { name_parts.push('read'); }

        // If type === null, attempt to detect it by the predefined value.
        if (this.meta.type === null) {
            if (proto_ref === null) {
                name_parts.push('mixed');
            } else {
                name_parts.push(typeof (proto_ref));
            }
        } else {
            name_parts.push(this.meta.type);
        }

        name_parts.push('"' + this.meta.name + '"');
        name = name_parts.join(' ');

        if (typeof (proto_ref) === 'function') {
            body = '[Function]';
        } else if (typeof (proto_ref) === 'object' && proto_ref !== null) {
            body = '[Object (' + proto_ref.length + ')]';
        } else if (typeof (proto_ref) === 'string') {
            body = '"' + proto_ref + '"';
        } else {
            body = proto_ref;
        }
        return name + ': ' + body;
    }
});

JOII.Reflection.Method = JOII.ClassBuilder({ 'extends': JOII.Reflection.Property }, {

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
                var args = [];
                fnText = fn.toString().replace(STRIP_COMMENTS, '');
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

        var prototype = this.reflector.getProto();
        var overloads = prototype.__joii__.metadata[this.name].overloads;

        if (!overloads || overloads.length === 0) {
            // old method for BC (wasn't recognized as a function when prototyping)
            return getParams(this.reflector.getProto()[this.name]);
        } else if (overloads.length === 1 && overloads[0].parameters.length === 0) {
            // old method for BC (was recognized when prototyping, but old style)
            return getParams(overloads[0].fn);
        }
        else {
            var ret = [];

            for (var idx = 0; idx < overloads.length; idx++) {
                var fn_meta = [];
                var function_parameters_meta = overloads[idx];
                var parsed_params = getParams(function_parameters_meta.fn);
                for (var j = 0; j < function_parameters_meta.parameters.length; j++) {
                    var param = {
                        name: parsed_params.length > j ? parsed_params[j] : null,
                        type: function_parameters_meta.parameters[j]
                    };
                    fn_meta.push(param);
                }
                ret.push(fn_meta);
            }
            return ret;
        }
    },

    /**
     * Returns the body of this method as a string.
     *
     * @return string
     */
    'public getBodyAsString': function(f) {
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
            fn_text        = this.reflector.getProto()[this.name].toString().replace(STRIP_COMMENTS, '');

        return fn_text.substr(fn_text.indexOf('{') + 1, fn_text.lastIndexOf('}') - 4).replace(/}([^}]*)$/, '$1');
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

        if (args.length > 0 && typeof (args[0]) === 'object') {
            // right now, this is spitting out every overload's signature one after another, each on a new line.
            // should probably find a better way to do this
            for (var idx = 0; idx < args.length; idx++) {
                var function_parameters_meta = args[idx];

                body += ' (';

                var first_time = true;
                for (var i = 0; i < function_parameters_meta.length; i++) {
                    if (!first_time) {
                        body += ', ';
                    }
                    first_time = false;
                    body += function_parameters_meta[i].type;
                    if (function_parameters_meta[i].name !== null) {
                        body += " " + function_parameters_meta[i].name;
                        is_var = true;
                    }
                }


                var data = this.reflector.getProto().__joii__.metadata[this.name].overloads[idx].fn.toString();
                is_var = data.match(/[\(|\.|\ ](arguments)[\)|\.|\,|\ |]/g);

                if (is_var) {
                    body += ', ...';
                }
                body += ')\n';
            }
        } else if (args.length > 0) {
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

    root.JOII      = JOII; // Access to internals. (used by unit tests & Reflection)
    root.Class     = JOII.ClassBuilder;
    root.Interface = JOII.InterfaceBuilder;
    root.Enum      = JOII.EnumBuilder;

    /**
     * Registers JOII to the global scope. You should only need this in Node
     * environments.
     */
    root.useGlobal = function () {
        var g = (typeof window === 'object' ? window : global);

        for (var i in root) {
            if (root.hasOwnProperty(i) === false) continue;
            g[i] = root[i];
        }
    };

    return root;
}));
