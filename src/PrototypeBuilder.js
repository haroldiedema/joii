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

    g.JOII.InternalPropertyNames = ['__joii__', 'super', 'instanceOf'];
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

            prototype.__joii__.implementations.push(parent.__joii__.name);

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

                    if (typeof(scope.__joii__.parent) === 'undefined') {
                        if(typeof(scope.__api__.__joii__.parent) !== 'undefined') {
                            scope.__joii__.parent = scope.__api__.__joii__.parent;
                        } else {
                            throw new Error('Method "' + method + '" does not exist in the parent class. (called using \'super()\')');
                        }
                    }

                    var m = scope.__joii__.parent[method];
                    current_scope.__joii__ = scope.__joii__.parent.__joii__;
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
        var data     = str.toString().replace(/ +(?= )/g,'').split(' '),
            name     = data[data.length - 1],
            types    = g.JOII.InternalTypeNames,
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
                'is_generated' : false      // Is the property generated?
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
                        metadata.type = g.JOII.InterfaceRegistry[data[i]].definition.__interface__.name;
                        break;
                    }
                    // Check for Class-types
                    if (typeof(g.JOII.ClassRegistry[data[i]]) !== 'undefined') {
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
            setter_fn = new Function('v', (meta.type !== null ? validator : '' ) + 'this["' + meta.name + '"] = v; return this;');
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