/*                                                        ____.      .__.__
 Javascript Object Inheritance Implementation            |    | ____ |__|__|
 Copyright 2014, Harold Iedema. All rights reserved.     |    |/  _ \|  |  |
---------------------------------------------------- /\__|    (  <_> )  |  | --
                                                     \________|\____/|__|__|

 THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES,
 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS
 OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
 BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 POSSIBILITY OF SUCH DAMAGE.

 ------------------------------------------------------------------------------
*/
var _g = (typeof(window) !== 'undefined') ? window : global;

_g.$JOII = {
        /**
         * JOII's public API.
         *
         * Methods in here are exposed to the desired namespace, if specified.
         * Defaults to 'window' or 'global' if running from NodeJS.
         */
        PublicAPI: {

            /**
             * Creates a new Class.
             *
             * @param object params
             * @param object body
             */
            'Class': function(params, body) {
                if (typeof(body) === 'undefined') {
                    body   = params;
                    params = {};
                }
                return (new _g.$JOII.ClassBuilder(params, body));
            },

            /**
             * Creates a new interface.
             *
             * @param object body
             */
            'Interface': function(body) {
                var o = new Object();
                var s = _g.$JOII.System.guid()();
                for (var i in body) {
                    o[i] = body[i];
                }
                _g.$JOII.Compat.CreateProperty(o, '__interface__', s);
                _g.$JOII.Interfaces[s] = o;
                return o;
            },

            /**
             * Registers a defined class as a service.
             *
             * @param string name
             * @param object class_object
             * @param object arguments
             * @return void
             */
            'Service': function(name, class_object, arguments) {
                if (typeof(_g.$JOII.Services[name]) !== 'undefined') {
                    throw new Error('Another service with the name "' + name + '" is already defined.');
                }

                _g.$JOII.Services[name] = {
                    object    : class_object,
                    instance  : undefined,
                    arguments : arguments
                };
            },

            /**
             * Registers a new JOII-plugin.
             *
             * @param string name
             * @param object params
             */
            'RegisterJOIIPlugin': function(name, params)
            {
                _g.$JOII.Plugins[name] = {
                        compile  : params.compile || function(){},
                        supports : params.supports || function(){ return true; },
                        scope    : params.scope || {}
                };
            }
        },

        /**
         * JOII's class API.
         *
         * All methods in here are available within any class declaration.
         */
        PublicClassAPI: {

            /**
             * Calls the given parent method from the current scope.
             *
             * @param string method
             * @param ...
             */
            'super': function(method) {
                arguments = arguments || [];
                var args          = Array.prototype.slice.call(arguments, 1),
                    current_scope = this,
                    original_prop = this.__joii__,
                    call          = function(scope, method, args) {
                        if (typeof(scope) === 'undefined') {
                            throw new Error('Parent method "' + method + '" does not exist.');
                        }
                        if (typeof(scope.__joii__.parent) !== 'undefined' &&
                            typeof(scope.__joii__.parent.prototype[method]) === 'undefined') {
                            return call(scope.__joii__.parent, method, args);
                        }

                        if (typeof(scope.__joii__.parent) === 'undefined') {
                            throw new Error('Method "' + method + '" does not exist.');
                        }

                        var m = scope.__joii__.parent.prototype[method];

                        current_scope.__joii__ = scope.__joii__.parent.prototype.__joii__;
                        var r = m.apply(current_scope, args);
                        current_scope.__joii__ = original_prop;
                        return r;
                    };

                return call(this, method, args);
            },

            /**
             * Returns true if this class is an instance of the given object.
             *
             * @param function object
             * @return bool
             */
            'instanceOf': function(object) {

                if (typeof(object.__joii__) !== 'undefined') {
                    object = object.__joii__.clean_prototype;
                }

                if (typeof(object.__interface__) !== 'undefined') {
                    return _g.$JOII.Compat.indexOf(this.__joii__.interfaces, object.__interface__) !== -1;
                }

                var check = function(_this, object)
                {
                    var scope = _this;
                    if (typeof(_this.__joii__) !== 'undefined') {
                        _this = _this.__joii__.clean_prototype;
                    }
                    if (_this === object) {
                        return true;
                    }
                    if (typeof(scope.__joii__) !== 'undefined') {
                        if (typeof(scope.__joii__.parent) !== 'undefined') {
                            return check(scope.__joii__.parent, object);
                        }
                    }
                    return scope === object;
                };
                return check(this, object);
            },

            /**
             * Return an instance of the service by the given name.
             *
             * @param string service_name
             * @return object
             */
            'getService' : function(service_name) {
                return _g.$JOII.System.getService(service_name);
            }
        },

        /**
         * Plugins collection
         */
        Plugins: {},

        /**
         * Interface collection
         */
        Interfaces: {},

        /**
         * Service collection
         */
        Services: {},

        /**
         * Builds a class object which may be instantiated at run-time.
         *
         * @param object params
         * @param object body
         */
        ClassBuilder: function(params, body)
        {
            if (typeof(body) !== 'object') {
                throw new Error(
                    'Class body must be an Object, ' + typeof(body) + 'given');
            }

            // Representation of the resulting object.
            var product = _g.$JOII.System.ApplyPrototype(function(){

                var f = function(){};
                var object = _g.$JOII.Compat.extend(true, {}, Object.create(this));
                f.prototype = object;
                product = Object.create(new f());
                _g.$JOII.Compat.CreateProperty(product, '__joii__', this.__joii__);

                // Apply the public class API to the product
                for (var i in _g.$JOII.PublicClassAPI) {
                    if (typeof(product.i) !== 'undefined') {
                        throw new Error('Method "' + i + '" is reserved by JOII.');
                    }
                    _g.$JOII.Compat.CreateProperty(product, i, _g.$JOII.PublicClassAPI[i]);
                }

                _g.$JOII.System.ApplyPlugins(product, body);

                if (typeof(product.__construct) === 'function') {
                    arguments = arguments || [];
                    var api = product.__construct.apply(product, arguments);
                    if (typeof(api) === 'object') {
                        // Constructor returns a "public api"
                        var f = {};
                        for (var i in api) {
                            if (typeof(api[i]) === 'function') {
                                f[i] = api[i].bind(product);
                            } else {
                                f[i] = api[i];
                            }
                        }

                        _g.$JOII.Compat.CreateProperty(f, '__joii__', this.__joii__);
                        _g.$JOII.Compat.CreateProperty(f, body, _g.$JOII.PublicClassAPI[i]);
                        _g.$JOII.System.ApplyPlugins(f, body);

                        // Check implemented interfaces
                        if (typeof(product.__joii__.interfaces) !== 'undefined' &&
                            this.__joii__.interfaces.length > 0) {
                            for (var i in product.__joii__.interfaces) {
                                var interf = _g.$JOII.Interfaces[product.__joii__.interfaces[i]];
                                for (var x in interf) {
                                    if (typeof(f[x]) !== interf[x]) {
                                        throw new Error('Public API must implement ' + interf[x] + ' "' + x + '" as defined in the interface the class implements.');
                                    }
                                }
                            }
                        }
                        return f;
                    }
                }

                // If we came at this point in the code, the __construct method
                // didn't return any object, thus the entire class is public.
                // Iterate over the implemented interfaces to validate the
                // exposed properties.
                for (var name in product.__joii__.implementation_list) {
                    var type = product.__joii__.implementation_list[name];
                    if (typeof(product[name]) !== type && name.charAt(0) !== '_' && name.charAt(1) !== '_') {
                        if (typeof(product[name]) === 'undefined') {
                            throw new Error('Class is missing ' + type + ' implementation of property "' + name +'".');
                        } else {
                            throw new Error('Property "' + name + '" must be of type "' + type + '", ' + typeof(name) + ' detected.');
                        }
                    }
                }

                return product;
            }, body);

            if (typeof(params['extends']) === 'function' &&
                typeof(params['extends'].prototype) === 'object') {
                product = _g.$JOII.System.ApplyParent(product, params['extends']);
            } else if (typeof(params['extends']) === 'object' ) {
                product = _g.$JOII.System.ApplyTrait(product, params['extends']);
            } else if (typeof(params['extends']) !== 'undefined') {
                throw new Error(
                        'Parent class must be a function containing a prototype.');
            }

            // Apply traits
            if (typeof(params['uses']) !== 'undefined') {
                if (typeof(params['uses'][0]) === 'undefined') {
                    var i = params['uses'];
                    params['uses'] = [i];
                }
                for (var i in params['uses']) {
                    if (typeof(params['uses'][i]) === 'object') {
                        for (var k in params['uses'][i]) {
                            var v = params['uses'][i][k];
                            if (typeof(product.prototype[k]) === 'undefined') {
                                product.prototype[k] = v;
                            }
                        }
                    }
                }
            }


            // Apply interfaces
            if (typeof(params['implements']) !== 'undefined' && typeof(params['implements'][0]) === 'undefined') {
                var i = params['implements'];
                params['implements'] = [];
                params['implements'].push(i);
            }
            params['implements'] = params['implements'] || [];
            product.__joii__['implements'] = params['implements'];
            product.__joii__['interfaces'] = [];

            _g.$JOII.System.ApplyInterfaces(product);

            // Apply the prototype of the product to __joii__ to make checking
            // instance-of possible.
            product.__joii__.clean_prototype = body;

            // Link the __joii__ property to the prototype, making it accessible
            // when using Class-API methods, like 'super'.
            _g.$JOII.Compat.CreateProperty(product.prototype, '__joii__', product.__joii__);

            return product;
        },

        /**
         * JOII's system methods.
         */
        System: {

            /**
             * Returns an instantiated a service.
             *
             * @param string service_name
             * @return object
             */
            getService: function(service_name)
            {
                if (typeof(_g.$JOII.Services[service_name]) === 'undefined') {
                    throw new Error('Service "' + service_name + '" is not defined.');
                }

                if (typeof(_g.$JOII.Services[service_name].instance) === 'undefined') {
                    var obj  = _g.$JOII.Services[service_name].object;
                    var cons = obj.prototype.__construct;
                    var args = [];

                    // Construct function to use '.apply' on 'new' objects.
                    var construct = function(constructor, args) {
                        var _ = [];
                        _[service_name] = function() {
                            return constructor.apply(this, args);
                        };
                        _[service_name].prototype = constructor.prototype;
                        return new _[service_name]();
                    };

                    // Class has a constructor. Check arguments and inject whatever we can!
                    if (typeof(cons) !== 'undefined') {
                        var params = function(func) {
                            var fnStr = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');
                            var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
                            if(result === null)
                                result = [];
                            return result;
                        }(cons);

                        var service_args = _g.$JOII.Services[service_name].arguments;

                        for (var param_name in params) {
                            var value = service_args[params[param_name]];
                            if (typeof(value) === 'string' && value.charAt(0) === '@') {
                                // Inject another service.
                                value = _g.$JOII.System.getService(value.substring(1, value.length));
                            }
                            args.push(value);
                        };
                    }
                    _g.$JOII.Services[service_name].instance = construct(obj, args);
                }
                return _g.$JOII.Services[service_name].instance;
            },

            /**
             * Applies the contents of 'object' to the prototype of 'product'.
             *
             * @param function product
             * @param object object
             */
            ApplyPrototype: function(product, object)
            {
                _g.$JOII.Compat.CreateProperty(product, '__joii__', {});
                for (var i in object) {
                    product.prototype[i] = object[i];
                }
                return product;
            },

            /**
             * Applies the parent scope to the product scope.
             *
             * @param function product
             * @param function parent
             */
            ApplyParent: function(product, parent)
            {
                product.__joii__.parent = new Object();
                product.__joii__.parent.prototype = parent.prototype;
                if (typeof(parent.__joii__) === 'object') {
                    product.__joii__.parent.__joii__ = parent.__joii__;
                }
                for (var i in parent.prototype) {
                    if (typeof(product.prototype[i]) === 'undefined') {
                        product.prototype[i] = parent.prototype[i];
                    }
                }
                return product;
            },

            /**
             * Applies contents of an object to the prototype of the product.
             *
             * @param function product
             * @param object object
             */
            ApplyTrait: function(product, object)
            {
                if (typeof(Object.getOwnPropertyNames) !== 'undefined') {
                    var props = Object.getOwnPropertyNames(object);
                    for (var k in props) {
                        if (typeof(product.prototype[props[k]]) === 'undefined') {
                            product.prototype[props[k]] = Math[props[k]];
                        }
                    }
                } else {
                    for (var i in object) {
                        if (typeof(product.prototype[i]) === 'undefined') {
                            product.prototype[i] = object[i];
                        }
                    }
                }
                return product;
            },

            /**
             * Applies all registered plugins to the given product.
             *
             * @param function product
             * @param object body
             */
            ApplyPlugins: function(product, body)
            {
                tmp_product = _g.$JOII.Compat.extend(true, {}, product);
                tmp_product.prototype = tmp_product;
                for (var i in _g.$JOII.Plugins) {
                    if (!_g.$JOII.Plugins[i].supports(tmp_product)) {
                        continue;
                    }
                    product.prototype = product;
                    if (undefined !== (p = _g.$JOII.Plugins[i].compile(product))) {
                        if (typeof(p.prototype) !== 'undefined') {
                            p = p.prototype;
                        }
                        product = p;
                    }
                    if (typeof(product.prototype) !== 'undefined') {
                        delete product.prototype;
                    }
                    for (var x in _g.$JOII.Plugins[i].scope) {
                        if (typeof(product[x]) !== 'undefined') {
                            if (typeof(body[x]) !== 'undefined') {
                                throw new Error('Method "' + x + '" is reserved by plugin "' + i + '".');
                            }
                            for (var name in _g.$JOII.Plugins) {
                                for (var m in _g.$JOII.Plugins[name].scope) {
                                    if (m === x && i !== name) {
                                        throw new Error('Method "' + x + '" from plugin "' + i + '" is already in use by plugin "' + name + '".');
                                    }
                                }
                            };
                        }
                        product[x] = _g.$JOII.Plugins[i].scope[x];
                    };
                }
            },

            ApplyInterfaces: function(product)
            {
                var collectInterfaces = function(scope, col)
                {
                    col = col || {};
                    for (var i in scope.__joii__['implements']) {
                        product.__joii__['interfaces'].push(scope.__joii__['implements'][i].__interface__);
                        for (var m in scope.__joii__['implements'][i]) {
                            col[m] = scope.__joii__['implements'][i][m];
                        }
                    }
                    if (typeof(scope.__joii__.parent) !== 'undefined') {
                        var c = collectInterfaces(scope.__joii__.parent, col);
                        for (var i in c) {
                            col[i] = c[i];
                        }
                    }
                    return col;
                };
                product.__joii__.implementation_list = collectInterfaces(product);
            },

            /**
             * Generates a GUID.
             *
             * @return string
             */
            guid: function() {
                function s4() {
                  return Math.floor((1 + Math.random()) * 0x10000)
                             .toString(16)
                             .substring(1);
                }
                return function() {
                  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                         s4() + '-' + s4() + s4() + s4();
                };
            }
        },

        /**
         * Compatibility functions which are not supported in some order browsers.
         *
         * CreateNamespaceObject(name)  Creates a series of nested objects to
         *                              simulate a 'namespace'.
         *
         * CreateProperty(obj, val)     Creates a non-enumerable property. Browsers
         *                              that dont support Object.defineProperty
         *                              will have normal props created instead.
         */
        Compat: {

            /**
             * Detect if the given object is an array.
             * - original by jQuery (http://jquery.com/)
             */
            isArray: function(obj) {
                var length = obj.length,
                    type = typeof(obj);

                if (type === "function" || (typeof(window) !== 'undefined' && obj === window)) {
                    return false;
                }
                if (obj.nodeType === 1 && length) {
                    return true;
                }
                return Object.prototype.toString.call(obj) === '[object Array]';
            },

            /**
             * Extend an object onto another or use to 'copy' an object.
             * - original by jQuery (http://jquery.com/)
             */
            extend: function() {
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
                    if ((options = arguments[i]) != null) {
                        for (var name in options) {
                            src = target[name];
                            copy = options[name];
                            if (target === copy) { continue; }
                            if (deep && copy && (_g.$JOII.Compat.isPlainObject(copy) || (copyIsArray = _g.$JOII.Compat.isArray(copy)) ) ) {
                                if (copyIsArray) {
                                    copyIsArray = false;
                                    clone = src && _g.$JOII.Compat.isArray(src) ? src : [];
                                } else {
                                    clone = src && _g.$JOII.Compat.isPlainObject(src) ? src : {};
                                }
                                target[name] = _g.$JOII.Compat.extend(deep, clone, copy);
                            } else if (copy !== undefined) {
                                target[name] = copy;
                            }
                        }
                    }
                }
                return target;
            },

            /**
             * Detect if an object is a plain object.
             * - original by jQuery (http://jquery.com/)
             */
            isPlainObject: function( obj ) {
                var hasOwn = ({}).hasOwnProperty;
                if (typeof(obj) !== "object" || obj.nodeType || (typeof(window) !== 'undefined' && obj === window)) {
                    return false;
                }
                if ( obj.constructor &&
                        !hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
                    return false;
                }
                return true;
            },

            indexOf: function(array, value)
            {
                for (var i in array) {
                    if (array[i] === value) {
                        return i;
                    }
                }
                return -1;
            },

            /**
             * Creates a namespaced object.
             *
             * @param string namespace
             * @param mixed value
             */
            CreateNamespaceObject: function (namespace, value) {
                var object = window || global, tokens = namespace.split("."), token;

                while (tokens.length > 0) {
                    token = tokens.shift();
                    if (typeof(object[token]) === 'undefined') {
                        object[token] = {};
                    }
                    if (typeof(value) !== 'undefined' && tokens.length === 0) {
                        object[token] = value;
                        return object;
                    }
                    object = object[token];
                }
                return object;
            },

            CreateProperty: function(obj, name, val)
            {
                try {
                    if (typeof(Object.defineProperty) !== 'undefined') {
                        Object.defineProperty(obj, name, {
                            writable: true,
                            enumerable: false,
                            value: val
                        });
                    } else {
                        obj[name] = val;
                    }
                } catch (e) {
                    obj[name] = val;
                }
            }
        },

        // _____________________________________________________________________ //

    /**
     * Initializes the JOII-framework.
     */
    initialize: function()
    {
        var ns;
        if (typeof(window) === 'undefined' && typeof(module) !== 'undefined') {
            module.exports = _g.$JOII.PublicAPI;
            ns = _g;
        } else {
            var scripts = document.getElementsByTagName( 'script' ),
                current = scripts[scripts.length - 1];
            if (!(ns = current.getAttribute('data-ns'))) {
                ns = _g;
            }
            if (typeof(ns) === 'string') {
                ns = _g.$JOII.Compat.CreateNamespaceObject(ns);
            }
        }
        for (var i in _g.$JOII.PublicAPI) {
            if (_g.$JOII.PublicAPI.hasOwnProperty(i)) {
                ns[i] = _g.$JOII.PublicAPI[i];
            }
        }
    }
};

// Unfortunate, but mandatory IE 'polyfill'.
if (typeof(Object.create) === 'undefined') {
    Object.create = (function(){
        function F(){}
        return function(o){
            if (arguments.length != 1) {
                throw new Error('Object.create implementation only accepts one parameter.');
            }
            F.prototype = o;
            return new F();
        };
    })();
}
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                   ? this
                   : oThis,
                   aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}

_g.$JOII.initialize();
