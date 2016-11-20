/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
'use strict';

(function (factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(exports);
    } else {
        // Browser globals
        factory(window);
    }

} (function (root)
{
    // allows use as both raw source in the browser and compiled dist
    // easier to test/debug when using the raw source
    root = typeof (root) !== 'undefined' ? root : {};
    var JOII = typeof (root.JOII) !== 'undefined' ? root.JOII : {};

    /**
     * Source code combined/packaged using ISC to prevent scope bleeding.
     * @link https://npmjs.com/package/isc/
     *
     * @include("./Config.js")
     * @include("./Compatibility.js")
     * @include("./PrototypeBuilder.js")
     * @include("./ClassBuilder.js")
     * @include("./InterfaceBuilder.js")
     * @include("./EnumBuilder.js")
     * @include("./Reflection.js")
     */
    root.JOII      = JOII; // Access to internals. (used by unit tests & Reflection)
    root.Class     = JOII.ClassBuilder;
    root.Interface = JOII.InterfaceBuilder;
    root.Enum      = JOII.EnumBuilder;

    /**
     * Registers JOII to the global scope. You should only need this in Node
     * environments.
     */
    root.useGlobal = function () {
        var g = (typeof window === 'object' ? window : global);

        for (var i in root) {
            if (root.hasOwnProperty(i) === false) continue;
            g[i] = root[i];
        }
    };

    return root;
}));
