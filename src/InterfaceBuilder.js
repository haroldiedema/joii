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
