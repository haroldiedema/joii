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
JOII.Compat.findJOIIName = function(e, selfReferenced) {
    var i, r;

    if (typeof (e) === 'string' ||
        typeof (e) === 'number' ||
        typeof (e) === 'undefined' ||
        e === null
    ) {
        return false;
    }

    if (typeof (e.__joii__) !== 'undefined' && e.__joii__ !== null) {
        return e.__joii__.name;
    }
    if (typeof (e.prototype) !== 'undefined' && typeof (e.prototype.__joii__) !== 'undefined') {
        return e.prototype.__joii__.name;
    }
    
    // prevent infinite loops. Shouldn't need to go more than one deep.
    if (selfReferenced) {
        return false;
    }

    // Chrome / FF // IE 11+
    if (typeof (e.__proto__) !== 'undefined' && e.__proto__ !== null) {
        r = JOII.Compat.findJOIIName(e.__proto__, true);
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
            r = JOII.Compat.findJOIIName(e[i], true);
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
 * Recursively walks through a normal object, and flattens any JOII objects it finds, to prepare them for serialization
 *
 * @param  {Object} current_obj
 * @param  {Object} obj_base
 * @return {Boolean}
 */
JOII.Compat.flattenObject = function(current_obj) {
    var obj = null;
                    
    if (JOII.Compat.isArray(current_obj)) {
        obj = [];
    } else {
        obj = {};
    }

    for (var key in current_obj) {
        if (current_obj.hasOwnProperty(key) === false) continue;

        var currentValue = current_obj[key];

        if (typeof (currentValue) === 'object' && currentValue !== null && 'serialize' in currentValue && typeof (currentValue.serialize) === 'function') {
            try {
                obj[key] = currentValue.serialize(true);

                if (typeof(obj[key]) === 'string') {
                    // wasn't our serialize method. Try to deserialize back to an object to continue.
                    obj[key] = JSON.parse(obj[key]);
                }
            } catch (e) {
                // something went wrong with calling the object's serialize method. Fall back to normal crawling.
                obj[key] = JOII.Compat.flattenObject(currentValue);
            }
        } else if (typeof (currentValue) === 'object' && currentValue != null) {
            obj[key] = JOII.Compat.flattenObject(currentValue);
        } else {
            obj[key] = currentValue;
        }
    }

    return obj;
};

/**
 * Recursively walks through a normal object, and deserializes any JOII objects it finds,
 * optionally restoring to a current object while maintaining object references
 *
 * @param  {Object} current_obj
 * @param  {Object} obj_base
 * @return {Boolean}
 */
JOII.Compat.inflateObject = function(current_obj, obj_base) {
    var obj = obj_base || null;
    
    if (typeof (obj) !== 'object' || obj == null) {         
        if (JOII.Compat.isArray(current_obj)) {
            obj = [];
        } else {
            obj = {};
        }
    }

    for (var key in current_obj) {
        if (current_obj.hasOwnProperty(key) === false) continue;

        var currentValue = current_obj[key];
        
        if (typeof (currentValue) === 'object' && currentValue !== null && '__joii_type' in currentValue && typeof (currentValue.__joii_type) === 'string') {
            var name = currentValue.__joii_type;
            // Check for Interface-types
            if (typeof (JOII.InterfaceRegistry[name]) !== 'undefined') {
                throw 'Cannot instantiate an interface.';
            }
            // Check for Class-types
            else if (typeof (JOII.ClassRegistry[name]) !== 'undefined') {
                var oldValue = obj[key];
                if (typeof (oldValue) === 'object' && oldValue !== null && '__joii__' in oldValue && typeof (oldValue.__joii__) === 'object' && oldValue.__joii__ !== null && oldValue.__joii__.name === name) {
                    // try to deserialize in place if the object already exists. This avoids breaking object references.
                    oldValue.deserialize(currentValue);
                } else {
                    obj[key] = JOII.ClassRegistry[name].deserialize(currentValue);
                }
            } else {
                throw 'Class ' + name + ' not currently in scope!';
            }
        } else if (typeof (currentValue) === 'object' && currentValue != null) {
            obj[key] = JOII.Compat.inflateObject(currentValue, obj[key]);
        } else {
            obj[key] = currentValue;
        }
    }

    return obj;
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
};