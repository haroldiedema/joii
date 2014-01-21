/**
 * (JOII) Javascript Object Inheritance Implementation
 *
 * @author Harold Iedema <harold@iedema.me>
 */
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
        var obj_class = function(){ this.parent = {} };
        
        // Class inheritance
        if (typeof(params.extends) === 'function') {
            // If we're extending another 'Class', use this strange little "hack"
            // to get the results we need.
            if (params.extends.toString().indexOf('is-class-reference') !== -1) {
                var obj = Object.create(params.extends.prototype);
                obj_class  = params.extends.apply(obj, arguments);
            } else {
            // Use this for native functions/objects.
                var obj = Object.create(params.extends.prototype);
                params.extends.apply(obj, arguments);
                obj_class = obj;
            }
        }
        
        // Trait support
        var traits = {};
        if (params.uses !== undefined) {
            var uses = typeof(params.uses) === 'object' ? params.uses : [params.uses];
            // Iterate over "traits".
            for (var e in uses) {
                // ... And their functions...
                for (var i in uses[e]) {
                    if (typeof(uses[e][i]) === 'function') {
                        traits[i] = uses[e][i];
                    }
                }
            }
        }
        
        // Interface support
        var interfaces = [];
        if (params.implements !== undefined) {
            var implements = typeof(params.implements) === 'object' ? params.implements : [params.implements];
            for (var x in implements) {
                // For simplicity sake, we only allow objects to be implemented as interfaces.
                if (typeof(implements[x]) !== 'object') {
                    throw 'Interfaces should be of type Object, ' + typeof(implements[x]) + ' given.';
                }
                interfaces.push(implements[x]);
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
        }
        
        // Apply interfaces
        var i, name;
        obj_class.__interfaces__ = obj_class.__interfaces__ || [];
        for (var i in interfaces) {
            obj_class.__interfaces__.push(interfaces[i]);
        }
        
        for (i in interfaces) {
            for (name in interfaces[i]) {
                var type = typeof(interfaces[i][name]);
                if (typeof(obj_class[name]) !== type) {
                    throw 'Missing ' + type + ' implementation: ' + name;
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
        
        // If a __construct class exists, execute it just for the heck of it.
        if (typeof(o.__construct) === 'function') {
            o.__construct.apply(obj_class, arguments);
        }
            
        // Return the finalized product.
        return obj_class;
    }
}
