/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * Tests class property meta data and validation.
 */
test('PrototypeBuilder:MetaTraitTest', function(assert) {

    var observable = {
        __meta: {
            'observable': {
                
                // beforeDefine is called once when creating the prototype before looping through properties
                beforeDefine: function(prototype) {
                	if (prototype.__joii__.is_static) return;

                    assert.equal(prototype.__joii__.metadata['value'].name, 'value', 'beforeDefine passed correct arguments.');
                },
                
                // onDefine is called once for each property using this meta tag when creating the prototype
                onDefine: function(prototype, meta) {
                	if (prototype.__joii__.is_static) return;

                    assert.equal(prototype.__joii__.metadata['value'].name, 'value', 'onDefine passed correct arguments.');
                    assert.equal(meta.name, 'value', 'onDefine passed correct meta argument.');

                    var observe_name = 'observe' + JOII.CamelcaseName(meta.name);
                    var counter = 0;

                    // check to see if it's a property or function
                    if (typeof(meta.fn) === 'undefined') {

                        // it's a property. Standard observable rules apply.

                        var setter_name = JOII.GenerateSetterName(meta);

                        // throw a trampoline under the setter
                        var old_setter = prototype[setter_name];
                        prototype[setter_name] = function() {
                            var old_val = this[meta.name];

                            // call the real setter
                            old_setter.apply(this, arguments);

                            // if the value changed, notify observers
                            if (old_val != this[meta.name]) {
                                for (var i in this.__observers[meta.name]) {
                                    if (typeof (this.__observers[meta.name][i]) === 'function') {
                                        this.__observers[meta.name][i](this[meta.name], this.__api__, meta.name);
                                    }
                                }
                            }
                        };
                    
                    } else {

                        // it's a function
                    
                        // throw a trampoline under the function to notify observers when it's called
                        var old_fn = meta.fn;
                        meta.fn = function() {
                            // call the real function
                            old_fn.apply(this, arguments);
                            // notify observers
                            for (var i in this.__observers[meta.name]) {
                                if (typeof (this.__observers[meta.name][i]) === 'function') {
                                    this.__observers[meta.name][i](arguments, this.__api__, meta.name);
                                }
                            }
                        };
                    }
                    

                    // add a new "observe" accessor function to register callbacks to observers
                    var observer_fn = function(fn) {
                        counter++;
                        this.__observers[meta.name][counter] = fn;

                        var self = this;

                        // snapshot "counter" to return an anonymous object allowing disposal of the observable
                        return (function (idx){
                            return {
                                dispose: function() {
                                    if (idx in self.__observers[meta.name]) {
                                        delete self.__observers[meta.name][idx];
                                    }
                                }
                            };
                        })(counter);
                    };

			        var observer_meta = JOII.ParseClassProperty(meta.visibility + ' function ' + observe_name + '()', prototype.__joii__.name);
			        observer_meta.is_abstract = meta.is_abstract;
			        observer_meta.is_final = meta.is_final;
			        observer_meta.is_static = meta.is_static;
			        observer_meta.class_name = meta.class_name;

			        JOII.addFunctionToPrototype(prototype, observer_meta, observer_fn, true);

                },
                
                // afterDefine is called once when creating the prototype after looping through properties
                afterDefine: function(prototype) {
                	if (prototype.__joii__.is_static) return;

                    assert.equal(prototype.__joii__.metadata['value'].name, 'value', 'afterDefine passed correct arguments.');
                },



                // beforeNew is called once for each new object before looping through properties
                beforeNew: function(scope_in, scope_out)
                {
                    assert.equal(scope_in.__api__, scope_out, 'beforeNew passed correct arguments.');

                    // initialize object to store observer functions
                    scope_in.__observers = {};
                },

                // onNew is called once for each property using this meta tag for each new object
                onNew: function(scope_in, scope_out, meta)
                {
                    assert.equal(scope_in.__api__, scope_out, 'onNew passed correct scope arguments.');
                    assert.equal(meta.name, 'value', 'onNew passed correct meta argument.');

                    // initialize object to store observer functions
                    scope_in.__observers[meta.name] = {};
                },

                // afterNew is called once for each new object after looping through properties
                afterNew: function(scope_in, scope_out)
                {
                    assert.equal(scope_in.__api__, scope_out, 'afterNew passed correct arguments.');
                }
            }
        }
    };

    var MyClass = JOII.ClassBuilder({ 'uses': observable }, {
        'public observable number value': 0
    });

    var mc = new MyClass();
    
    assert.equal(typeof(mc['observeValue']), 'function', 'Trait applied correctly.');
    
    var test_value = 0;
    var test_value2 = 0;
    var test_value3 = 0;
    var observer = mc.observeValue(function(val) { test_value = val; });
    var observer2 = mc.observeValue(function(val) { test_value2 = val + 10; });
    var observer3 = mc.observeValue(function(val) { test_value3 = val + 100; });

    mc.setValue(2);
    
    assert.equal(test_value, 2, 'Observer fired correctly.');
    assert.equal(test_value2, 12, 'Observer fired correctly.');
    assert.equal(test_value3, 102, 'Observer fired correctly.');

    // remove a couple of the observers
    observer.dispose();
    observer3.dispose();
    
    // change value
    mc.setValue(3);
    
    // verify that only the one remaining attached observer fired
    assert.equal(test_value, 2, "Observer didn't fire as expected.");
    assert.equal(test_value2, 13, "Observer didn't fire as expected.");
    assert.equal(test_value3, 102, "Observer didn't fire as expected.");

});
