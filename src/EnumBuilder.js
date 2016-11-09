/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/

JOII = typeof (JOII) !== 'undefined' ? JOII : {};
JOII.EnumRegistry = {};

/**
 * An enumerator can be used for type checking to validate if the given
 * value exists within the object as a constant value.
 */
JOII.EnumBuilder = JOII.ClassBuilder({ 'final' : true }, {

    'public immutable string name'      : null,
    'public immutable object constants' : {},

    /**
     * @param {String} name
     * @param {Object} obj
     */
    __construct: function(name, obj)
    {
        this.name      = name;
        this.constants = obj;
    },

    /**
     * Returns true if a constant with the given value exists within this
     * enumerator.
     *
     * @param  {*} value
     * @return bool
     */
    contains: function(value)
    {
        for (var i in this.constants) {
            if (this.constants.hasOwnProperty(i) === false) continue;
            if (this.constants[i] === value) {
                return true;
            }
        }
        return false;
    },

    /**
     * Registers a new Enumerator type with the given name and object.
     *
     * @param  {String} name
     * @param  {Object} obj
     * @return JOII.EnumBuilder
     */
    __call: function(name, obj) {
        if (typeof (name) !== 'string') {
            throw 'Argument #1 of Enum must be a string, ' + typeof (name) + ' given.';
        }
        if (typeof (obj) === 'function' &&
            typeof (obj.prototype.__joii__) !== 'undefined') {
            obj = obj.prototype.__joii__.constants;
        }

        if (typeof (obj) !== 'object') {
            throw 'Argument #2 of Enum must be an object or definition, ' + typeof (obj) + ' given.';
        }

        if (typeof (JOII.EnumRegistry[name.toLowerCase()]) !== 'undefined') {
            throw 'Enumerator "' + name + '" already exists.';
        }

        var enumerator = new JOII.EnumBuilder(name, obj);
        for (var i in obj) {
            if (typeof (obj[i]) === 'function') {
                throw 'An enumerator cannot contain functions. "' + i + '" is a function.';
            }
            if (typeof (obj[i]) === 'object') {
                throw 'An enumerator cannot contain objects. "' + i + '" is an object.';
            }
            JOII.CreateProperty(enumerator, i, obj[i], false);
        }
        JOII.EnumRegistry[name.toLowerCase()] = enumerator;
        return enumerator;
    }
});
