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
            definition = g.JOII.InterfaceDefinitionConstruct;

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

    /**
     * Template function for an interface constructor.
     *
     * This function will validate the requirements from the interface against
     * the given class or prototype.
     *
     * @param object prototype
     * @return bool
     */
    g.JOII.InterfaceDefinitionConstruct = function(prototype)
    {
        var reflector  = new g.JOII.Reflection.Class(prototype),
            properties = this.reflector.getProperties(),
            methods    = this.reflector.getMethods(),
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
}(
    typeof(global) !== 'undefined' ? global : window,
    undefined
));