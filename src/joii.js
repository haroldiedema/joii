// Crappy IE hack. (IE 8 and below)
if(Object.create === undefined) {
    Object.create = function( o ) {
        function F(){}
        F.prototype = o;
        return new F();
    };
}

function Class(params, body)
{
    // Support only one argument if params are not required.
    if (body === undefined && typeof params === 'function') {
        body   = params;
        params = {};
    }

    // Public API.
    return function() {

        // Construct our object.
        var obj_class = function(){ };

        // Class inheritance
        if (typeof(params['extends']) === 'string') {
            var alias = params['extends'];
            params['extends'] = __joii__.aliases[alias];
            if (typeof(params['extends']) === 'undefined') {
                throw 'Alias "' + alias + '" does not exist.';
            }
        }
        if (typeof(params['extends']) === 'function') {
            // If we're extending another 'Class', use this strange little "hack"
            // to get the results we need.
            if (params['extends'].toString().indexOf('is-class-reference') !== -1) {
                var obj = Object.create(params['extends'].prototype);
                obj_class  = params['extends'].apply(obj, arguments);
            } else {
            // Use this for native functions/objects.
                var obj = Object.create(params['extends'].prototype);
                params['extends'].apply(obj, arguments);
                obj_class = obj;
            }
        }

        // Trait support
        var traits = {};
        if (params.uses !== undefined) {
            var uses = typeof(params.uses) === 'object' ? params.uses : [params.uses];
            // Iterate over "traits".
            for (var e in uses) {
                if (typeof(uses[e]) === 'string') {
                    var alias = uses[e];
                    uses[e] = __joii__.aliases[alias];
                    if (typeof(uses[e]) === 'undefined') {
                        throw 'Alias "' + alias + '" does not exist.';
                    }
                }
                // ... And their functions...
                for (var i in uses[e]) {
                    if (typeof(uses[e][i]) === 'function') {
                        traits[i] = uses[e][i];
                    }
                }
            }
        }

        // Interface support
        var interface_inheritance_blacklist = ['implements', '__interfaces__'];
        var interfaces = [];
        if (params.implements !== undefined) {
            var implements = typeof(params.implements) === 'object' ? params.implements : [params.implements];
            for (var x in implements) {
                if (typeof(implements[x]) === 'string') {
                    var alias = implements[x];
                    implements[x] = __joii__.aliases[alias];
                    if (typeof(implements[x]) === 'undefined') {
                        throw 'Alias "' + alias + '" does not exist.';
                    }
                }
                if (typeof(implements[x]) === 'object') {
                    interfaces.push(implements[x]);
                } else if(typeof(implements[x]) === 'function') {
                    var obj = Object.create(implements[x].prototype);
                    var inf_class = implements[x].apply(obj, arguments);
                    var imp = {};
                    for (var i in inf_class) {
                        // Blacklist
                        if (interface_inheritance_blacklist.indexOf(i) !== -1) {
                            continue;
                        }
                        imp[i] = inf_class[i];
                    }
                    interfaces.push(imp);
                } else {
                    throw 'Unknown interface type: ' + typeof(implements[x]);
                }
            }
        }

        // Instantiate/construct the current scope.
        var o = Object.create(body.prototype);

        // Apply "traits"
        for (var i in traits) {
            // Don't overwrite a method if it already exists.
            if (o[i] === undefined) {
                o[i] = traits[i];
            }
        }

        // Invoke construct.
        var construct_result = body.apply(o, arguments);

        // Apply elements from current scope to our class.
        for (var i in o) {
            // If a method already exists in this scope, move it to the parent.
            if (obj_class[i] !== undefined) {
                obj_class.parent = obj_class.parent || {};
                obj_class.parent[i] = obj_class[i];
            }
            obj_class[i] = o[i];

            // Since "name" is a reserved property of 'prototype', we'll have to
            // save it somewhere else...
            if (i === 'name') {
                console.warn("A property 'name' is ignored since its a reserved name by Prototype. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name. Your value has been stored in this._name instead.");
                obj_class._name = o[i];
            }
        }


        // Apply interfaces
        var i, interface_name;
        obj_class.__interfaces__ = obj_class.__interfaces__ || [];
        for (var i in interfaces) {
            obj_class.__interfaces__.push(interfaces[i]);
        }

        for (i in interfaces) {
            for (interface_name in interfaces[i]) {
                if (typeof(obj_class[interface_name]) !== interfaces[i][interface_name]) {
                    throw 'Missing ' + interfaces[i][interface_name] + ' implementation: ' + interface_name;
                }
            }
        }

        /**
         * Returns true if this class contains an implementation of {i}.
         *
         * @return boolean
         */
        obj_class.implements = function(i)
        {
            var sig = [];
            if (typeof(i) === 'string') {
                var alias = i;
                i = __joii__.aliases[alias];
                if (typeof(i) === 'undefined') {
                    throw 'Alias "' + alias + '" does not exist.';
                }
            }
            for (var x in i) {
                sig.push(typeof(i[x]) + ':'+x);
            }
            sig = JSON.stringify(sig);
            for (var i in this.__interfaces__) {
                var sig_i = [];
                for (var x in this.__interfaces__[i]) {
                    sig_i.push(typeof(this.__interfaces__[i][x]) + ':' + x);
                }
                sig_i = JSON.stringify(sig_i);
                if (sig === sig_i) {
                    return true;
                }
            }
            return false;
        }

        // If we have a destructor method, bind it to the window unload event.
        // Some browsers might freak out on this, so don't rely on it if you
        // wish to support older browsers.
        if (typeof(o.__destruct) === 'function') {
            window.addEventListener('beforeunload', function(event) {
                return o.__destruct.call(obj_class, event);
            });
        }

        // Since __destruct binds to 'beforeunload', we also might want to
        // implement something that binds to 'unload'.
        if (typeof(o.__unload) === 'function') {
            window.addEventListener('unload', function(event) {
                return o.__unload.call(obj_class, event);
            });
        }

        // If a __construct class exists, execute to support constructors in
        // classes declared as objects instead of functions.
        if (typeof(o.__construct) === 'function') {
            o.__construct.apply(obj_class, arguments);
        }

        // Alias registration
        if (typeof(params.name) === 'string') {
            __joii__.aliases[params.name] = obj_class;
        }

        // Return the finalized product.
        return obj_class;
    }
}
/**
 * Interface implementation for creation of class 'rules'.
 *
 * Example:
 *     var iTest = new Interface({ 'extends': iAnotherInterface }, {
 *         myMethod: 'function',
 *         my_property: 'string'
 *     });
 */
Interface = function(params, body) {

    // Support only one argument if params are not required.
    if (body === undefined && typeof params === 'function') {
        body   = params;
        params = {};
    }

    var implementation = {}, obj, ret, i;

    if (typeof(params['extends']) === 'string') {
        var alias = params['extends'];
        params['extends'] = __joii__.aliases[alias];
        if (typeof(params['extends']) === 'undefined') {
            throw 'Alias "' + alias + '" does not exist.';
        }
    }

    if (typeof(params['extends']) === 'function') {
        obj = Object.create(params['extends'].prototype);
        ret = params['extends'].apply(obj);
        for (i in obj) {
            implementation[i] = obj[i];
        }
    }

    if (typeof(params['extends']) === 'object') {
        implementation = params['extends'];
    }
    if (typeof(body) === 'function') {
        obj = Object.create(body.prototype);
        ret = body.apply(obj);

        for (i in obj) {
            implementation[i] = obj[i];
        }
    } else {
        for (var i in body) {
            implementation[i] = body[i];
        }
    }

    if (typeof(params.name) === 'string') {
        __joii__.aliases[params.name] = implementation;
    }
    return implementation;
};
