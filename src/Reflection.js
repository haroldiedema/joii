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
