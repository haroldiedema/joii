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
