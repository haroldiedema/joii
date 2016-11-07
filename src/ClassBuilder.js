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
    JOII.ClassBuilder = function()
    {
        var args        = JOII.Compat.ParseArguments(arguments),
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
            scope_in = JOII.Compat.extend(true, {}, scope_in);

            if (typeof this !== 'undefined') {
                JOII.CreateProperty(scope_in, '__joii__', (this.__joii__));
                JOII.CreateProperty(scope_out, '__joii__', (this.__joii__));
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
                        scope_out[i] = JOII.Compat.Bind(scope_in[i], scope_in);
                    }
                }
            }

            // If 'this.__joii__' is not available, that would indicate that
            // we've been executed like a function rather than being instantiated.
            if (typeof(this) === 'undefined' || typeof(this.__joii__) === 'undefined') {
                // If the method __call exists, execute it and return its result.

                for (var c in JOII.Config.callables) {
                    if (JOII.Config.callables.hasOwnProperty(c)) {
                        if (typeof(body[JOII.Config.callables[c]]) === 'function') {
                            var result = body[JOII.Config.callables[c]].apply(body, arguments);
                            if (result === body) {
                                throw JOII.Config.callables[c] + ' cannot return itself.';
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
            for (var c in JOII.Config.constructors) {
                if (JOII.Config.constructors.hasOwnProperty(c)) {
                    var cc = JOII.Config.constructors[c];
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
        definition.prototype = JOII.PrototypeBuilder(name, parameters, body, false);

        // Apply constants to the definition
        for (var i in definition.prototype.__joii__.constants) {
            JOII.CreateProperty(definition, i, definition.prototype.__joii__.constants[i], false);
        }

        // Does the class implement an enumerator?
        if (typeof(parameters['enum']) === 'string') {
            var e = JOII.EnumBuilder(parameters['enum'], definition);
            if (parameters.expose_enum === true) {
                var g = typeof window === 'object' ? window : global;
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
        definition.prototype.__joii__.getInterfaces = JOII.Compat.Bind(function() {
            var interfaces = [],
                getRealInterface = JOII.Compat.Bind(function(i) {
                    if (typeof(i) === 'function') {
                        return i;
                    } else if (typeof(i) === 'string') {
                        if (typeof(JOII.InterfaceRegistry[i]) === 'undefined') {
                            throw 'Interface "' + i + '" does not exist.';
                        }
                        return JOII.InterfaceRegistry[i];
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
        if (typeof(JOII.ClassRegistry[name]) !== 'undefined') {
            throw 'Another class named "' + name + '" already exists.';
        }
        JOII.ClassRegistry[name] = definition;

        definition.prototype = JOII.Compat.extend(true, {}, definition.prototype);

        return definition;
    };
