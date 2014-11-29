# What is JOII?

JOII (short for JavaScript Object Inheritance Implementation) brings ***class-
based programming to JavaScript*** without the use of a compiler. Everything
is done using native JavaScript. JOII allows you to build your applications 
using Classes and Interfaces as you would in most other object oriented 
languages. JOII is built with the priciple of being compatible with _any_ 
browser on the market. Therefore, JOII is supported by Internet Explorer
5.5 and anything that came after that.

[Full documentation can be found here](http://joii.harold.info/)

## Features

 * Support Internet Explorer 5.5 and up
 * [Build](http://joii.harold.info/class/introduction) and [extend](http://joii.harold.info/class/inheritance) on classes
 * Support for [interfaces](http://joii.harold.info/interface/introduction)
 * Strong [typehinting](http://joii.harold.info/meta/types) in class properties
 * [Typehinting](http://joii.harold.info/meta/types) for custom object definitions
 * [Visibility setting](http://joii.harold.info/meta/visibility) (public, protected)
 * [Final](http://joii.harold.info/meta/final) & [abstract](http://joii.harold.info/meta/abstract) properties and methods
 * [Traits / Mix-ins](http://joii.harold.info/class/traits)
 * [Enums](http://joii.harold.info/enum/introduction)
 * [Reflection](http://joii.harold.info/reflection/introduction)

## License

Like most other popular JavaScript libraries, JOII is released under the [MIT license](http://en.wikipedia.org/wiki/MIT_License).

The MIT License is simple and easy to understand and it places almost no restrictions on what you can do with a JOII project.
You are free to use any JOII-project in any other project (even commercial projects) as long as the copyright header is left intact.
All sample codes on this website are public domain, meaning you're free to do with them as you please.

## Sneak peek

This is an example of what JOII looks like in action.

```javascript
// Define a simple class called "Person".
var Person = Class({

    // Declare a property called 'name'.
    'public immutable string name' : null,
    
    // Declare a constructor to be executed upon instantiation.
    'private __construct': function (name) {
        this.name = name;
    }
});

// Define a class called "Employee" that extends on "Person"
var Employee = Class({ extends: Person }, {

    // Add an 'occupation' property.
    'public nullable string occupation' : null,
    
    // Override the constructor from "Person".
    'private __construct' : function (name, occupation) {
        // invoke the parent constructor
        this.super('__construct', name);
        
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

Find out more about this in the [getters and setters](http://joii.harold.info/class/getters-and-setters)
section.