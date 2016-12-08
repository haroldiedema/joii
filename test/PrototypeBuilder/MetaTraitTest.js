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
            'observable': function(prototype, meta) {
                if (typeof(meta.overloads) !== 'object') {
                    var setter_name = JOII.GenerateSetterName(meta);
                    var observe_name = 'observe' + JOII.CamelcaseName(meta.name);
                    var old_setter = prototype[setter_name];
                    var observers = {};
                    var counter = 0;

                    prototype[setter_name] = function() {
                        var old_val = this[meta.name];
                        old_setter.apply(this, arguments);
                        if (old_val != this[meta.name]) {
                            for (var i in observers) {
                                if (typeof(observers[i]) === 'function') {
                                    observers[i](this[meta.name], this.__api__, meta.name);
                                }
                            }
                        }
                    };
                
                    prototype[observe_name] = function(fn) {
                        observers[counter] = fn;

                        return (function (idx){
                            return {
                                dispose: function() {
                                    if (idx in observers) {
                                        delete observers[idx];
                                    }
                                }
                            };
                        })(counter++);
                    };
                } else {
                    var old_fn = meta.fn;

                    meta.fn = function() {
                        for (var i in observers) {
                            if (typeof(observers[i]) === 'function') {
                                observers[i](arguments, this.__api__, meta.name);
                            }
                        }
                    };
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

    observer.dispose();
    observer3.dispose();
    
    mc.setValue(3);
    
    assert.equal(test_value, 2, "Observer didn't fire as expected.");
    assert.equal(test_value2, 13, "Observer didn't fire as expected.");
    assert.equal(test_value3, 102, "Observer didn't fire as expected.");

});
