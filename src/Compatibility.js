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
