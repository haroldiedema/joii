[![GitHub version](https://badge.fury.io/gh/haroldiedema%2Fjoii.svg)](https://badge.fury.io/gh/haroldiedema%2Fjoii) [![Build Status](https://scrutinizer-ci.com/g/haroldiedema/joii/badges/build.png?b=master)](https://scrutinizer-ci.com/g/haroldiedema/joii/build-status/master) [![npm version](https://badge.fury.io/js/joii.svg)](https://badge.fury.io/js/joii) 

# What is JOII?

JOII (short for JavaScript Object Inheritance Implementation) brings ***class-
based programming to JavaScript*** without the use of a compiler. Everything
is done using native JavaScript. JOII allows you to build your applications 
using Classes and Interfaces as you would in most other object oriented 
languages. JOII is built with the priciple of being compatible with _any_ 
browser on the market. Therefore, JOII is supported by Internet Explorer
5.5 and anything that came after that.

[Full documentation can be found here](https://joii.harold.info/)

> ***UPGRADING TO 4.x***
>
> In node environments, JOII no longer exposes anything to the
> global scope. This means that functions like `Class`, `Interface` and `Enum` are no longer
> directly available by default. If you want to keep this behavior, use the `useGlobal()`
> function when requiring JOII.
> ```javascript
> require('joii').useGlobal();
> ```


## Features

 * Support Internet Explorer 5.5 and up
 * [Build](https://joii.harold.info/class/introduction) and [extend](https://joii.harold.info/class/inheritance) on classes
 * Support for [interfaces](https://joii.harold.info/interface/introduction)
 * Strong [typehinting](https://joii.harold.info/meta/types) in class properties
 * [Typehinting](https://joii.harold.info/meta/types) for custom object definitions
 * [Visibility setting](https://joii.harold.info/meta/visibility) (public, protected)
 * [Final](https://joii.harold.info/meta/final) & [abstract](https://joii.harold.info/meta/abstract) properties and methods
 * [Traits / Mix-ins](https://joii.harold.info/class/traits)
 * [Enums](https://joii.harold.info/enum/introduction)
 * [Reflection](https://joii.harold.info/reflection/introduction)
 * (since 3.1.0) Custom constructor and callable method names
 * (since 3.2.0) [Serialization support](https://joii.harold.info/class/serialization)
 * (since 4.1.0) [Function overloading](https://joii.harold.info/meta/overloads)

## IRC

JOII can be found on the freenode IRC server on channel #joii.


## License

Like most other popular JavaScript libraries, JOII is released under the [MIT license](https://en.wikipedia.org/wiki/MIT_License).

The MIT License is simple and easy to understand and it places almost no restrictions on what you can do with a JOII project.
You are free to use any JOII-project in any other project (even commercial projects) as long as the copyright header is left intact.
All sample codes on this website are public domain, meaning you're free to do with them as you please.

## Installation

### Browser

Load JOII like any other library. JOII does not require any dependencies.
```markup
<script src="/path/to/joii.min.js"></script>
```
> JOII is available as a bower package: `bower install joii`

### Node

Install using npm and automatically add to your package.json file using `--save` if you want.
```sh
npm install joii --save
```
Somewhere, in your node project:
```javascript
var JOII = require("joii");

var MyClass = JOII.Class({ /* ... /* });
```

#### Node & Global Scope
Since 4.x, JOII functions, such as `Class` and `Interface` are no longer leaked to the global
scope by default. To make these functions globally availalbe, use the `useGlobal()` function.
```javascript
require("joii").useGlobal();

var MyClass = Class({ /* ... */ });
```

### Running unit tests

1. Clone the repository from here.
2. Install dependencies through npm via `npm install`
3. Run the testsuite using the command `npm test`
4. Optionally, open `testsuite.html` in a browser to see the browser-version of the unit tests.


## Sneak peek

This is an example of what JOII looks like in action.

```javascript
// Define a simple class called "Person".
var Person = Class({

    // Declare a property called 'name'.
    'public immutable string name' : null,
    
    // Declare a constructor to be executed upon instantiation.
    'private construct': function (name) {
        this.name = name;
    }
});

// Define a class called "Employee" that extends on "Person"
var Employee = Class({ extends: Person }, {

    // Add an 'occupation' property.
    'public nullable string occupation' : null,
    
    // Override the constructor from "Person".
    'private construct' : function (name, occupation) {
        // invoke the parent constructor
        this.super('construct', name);
        
        // Set the given occupation.
        this.setOccupation(occupation);
    }
});

var bob = new Employee('Bob');
bob.setOccupation('Developer');

console.log(bob.getName()); // Bob
console.log(bob.getOccupation()); // Developer
```

As you can see, the example code uses setter and getter methods that we didn't
define. When a property is declared *public*, JOII automatically generates
getters and setters for this property and enforces type checking in them. 

> Properties are not exposed to the public, even if they are declared to be.

```javascript
// properties are never exposed to the public, this is undefined:
bob.occupation;

// This will throw an exception, because occupation must be a string:
bob.setOccupation(123);
```

When a property is declared protected, getters and setters are still generated
but are not exposed to the public. When a property is declared private, nothing
is generated.

Find out more about this in the [getters and setters](https://joii.harold.info/class/getters-and-setters)
section.

## Custom constructor methods

As of 3.1.0, it's possible to add custom constructor methods. To ensure full
compatibility with other JOII-based libraries, constructor method names are
only added and never replaced. When a constructor method is found, no more of
these will be executed upon instantiation.

You can add custom constructor method names using `JOII.Config.addConstructor('hello');`

For example:

```javascript
// Add the 'hello' constructor.
JOII.Config.addConstructor('hello');


var Hi = Class({
    hello: function () {
        console.log('Hello World!');
    }
});

// Outputs: "Hello World!"
new Hi();
```

Beware that original / existing constructors are leading, meaning they'll be
executed first.

```javascript
var Hi = Class({
    hello: function () {
        // I am never executed.
        console.log('Hello World!');
    }

    // __construct is the 'original' constructor, so it gets more priority over the
    // newly added one, 'hello'.
    __construct: function () {
        console.log('Hi there.');
    }
});
```

[Full documentation can be found here](https://joii.harold.info/)
