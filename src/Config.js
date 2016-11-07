/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
JOII.Config = {
    constructors : ['__construct', 'construct', '->', '=>'],
    callables    : ['__call', '<>'],

    /**
     * Adds a constructor method name. The first occurance of a function
     * named like one of these is executed. The rest is ignored to prevent
     * ambiguous behavior.
     *
     * @param {string} name
     */
    addConstructor : function (name) {
        if (JOII.Config.constructors.indexOf(name) !== -1) {
            return;
        }

        JOII.Config.constructors.push(name);
    },

    /**
     * Adds a callable method name, like __call. Only one of these is
     * executed if more than one exist to prevent ambiguous behaviour.
     *
     * @param {string} name
     */
    addCallable: function (name) {
        if (JOII.Config.callables.indexOf(name) !== -1) {
            return;
        }

        JOII.Config.callables.push(name);
    }
};
