# JOII 3.0 is coming _soon_!

JOII 3.0 is currently in internal beta and will be coming ***soon!***
A little list of most notable changes / features:

* Properties are declared public/protected/abstract/final/nullable/type in declaration (see example below)
* Interfaces and classes support & enforce type-checking on properties
* Properties are always "protected" and not directly accessible from the outside
* Automatically generated `getters` and `setters` (Read-only properties will not get a setter, `private` properties will get neither.)
* Support for `__call`: Execute different logic when your class is executed as a function rather than being instantiated.
* Support for `abstract` classes and properties.
* Support for `Reflection`: Retrieve metadata from your class definitions (property visibility, function arguments, etc.)
* A clean code-base. Functionality is separated over several files. Unit-tests are separated by category.
* Best of all: It **still** works flawlessly on Internet Explorer 5.5 and up ;)

### A little teaser:
```javascript
//Create an interface, making an instance of "Person" usabe as a type.
var Person = Interface('Person', {
    // Don't automatically generate a setter by applying the "read" flag
    'public immutable string name'  : null,
    'public immutable string email' : null
});

// Create a class that implements the Person interface.
var SomePerson = Class({ 'implements': Person }, {
    'public immutable string name'  : null,
    'public immutable string email' : null,
    
    // Class constructor
    'protected __construct' : function(name, email) {
        this.name = name;
        this.email = email;
    }
});

var PersonHolder = Class({}, {
    // Making a property nullable, allows "null" or "undefined" to be passed to setters.
    'public nullable Person owner'  : null,
    
    // It is also possible to use a class definition as a type.
    'public SomePerson some_person' : null
});

// Instantiate the PersonHolder class.
var ph = new PersonHolder();

// When passing something that isn't null or an instance of Person to the setters, an error
// is thrown: "setOwner expects an instance of Person, string given."
ph.setOwner('Something'); 

// Fill the two properties by invoking the associated setters...
ph.setOwner(new SomePerson('John Doe', 'jd@example.com'));
ph.setSomePerson(new SomePerson('Bob Marley', 'bmarley@example.com'));

// Retrieve some data we've just set.
console.log(ph.getOwner().getName());       // John Doe
console.log(ph.getSomePerson().getEmail()); // bmarley@example.com
```

***IMPORTANT INFO ABOUT BACKWARDS COMPATIBILITY*** 

Before you get all scared about having to rewrite your entire application (or applications), please keep reading. It's not all bad...

#### The following will keep working as usual
- Nearly everything is backwards compatible except for parameters (read on...)
- Declaration of properties as strings is **optional**: Defining visibility (`public`, `protected`) is optional. By default everything is public if you don't specify anything.
- Class definitions work as they do now: `Class([parameters], <body>)`
- Interfaces can be declared and used as they do now.
- Classes can still be extended as normal (although some issues are fixed, most importantly issue #9)
- Getters and setters are not overwritten if you already define them.
- Traits - also known as mix-ins -  (using the `uses` class-parameters) remain functional as they are now.

#### The following _will_ change or break
- Most important: Properties are _always_ protected, meaning they are not directly accessible from outside the class scope. Using getters/setters has always been best-practice, JOII will enforce you to do so with 3.0 (see extra note below).
- Public API used to be defined by returning an object from the `__construct` function. This is obviously no longer needed.
- Defining `final` properties in the class-parameter is no longer working. You can now declare properties and methods as final directly in the declaration.
- The plugin-system gets a full make-over.
- Applying the JOII-API in a custom namespace, using the `data-ns` attribute on your `script`-tag is now done using a small initialisation function (to provide full compatibility with NodeJS and PhantomJS).
- Visibility changes in the inheritance chain: If a parent class defines something being `public`, the overwritten property _needs_ to be `public` as well in the child class. Not doing so will cause an exception to be thrown.

***A little note about the properties***

Because JOII allows you to define public and protected methods, a class is basically built up in two scopes. The inside scope and the outside scope. Functions are bound to the inside scope (the `this` variable) while the variable holding the instance of your class has only access to the outside scope. Because JavaScript references object-types, modifying them in one scope will also update them in the other scope automatically. Unfortionately, this isn't the case for scalar types (strings, booleans, numbers, etc.).

Here's a little exmaple:
```javascript
var A = Class({
    // inside (this) scope
    a_string: 'Hello World',
    
    // outside (instance) scope
    getAString: function() {
        return this.a_string;
    }
});

var inst = new A();
inst.getAString(); // Hello World
inst.a_string = "Foobar!"
inst.getAString(); // Hello World
```
If there is only *one* scope, this wouldn't happen. I've thought about using one scope if everything in the class would be declared public, but that could easily break your entire application if only **one** method or property would be declared protected - which only works by introducing two scopes again.

I've seen other libraries using a "properties" object, which you _need_ to use to access your properties directly, but I absolutely refuse to do this "magic". Example: `inst.__properties.a_string = "Foobar";` 
After long consideration, and asking opinions from other skilled programmers and engineers, the best approach is to use getters and setters, period. I think most of you would agree on this. 

If you don't agree with this approach, let me try to convince you anyway: If you have a custom setter for a property which performs some additional functionality, your application will most likely "break" if something from the outside modifies your property directly. This is _very_ dangerous and hard to debug in large applications. The same applies to custom getters with additional functionality ofcourse.

The visibility, abstract- and final state of a property is also copied to the generated getter and setter. This means that if you create a property which is final and public, the generated getter and setter methods will be final and public as well.


Feel free to leave feedback, suggestions or questions by opening an issue or sending me an email to harold@iedema.me.

Thank you very much for your interest and feedback! 
Expect to see a release in the coming weeks.

Enjoy your halloween and stay tuned!

~ Harold

-------------------------------------------------

# Features

* ***Supports Internet Explorer 5 and up***
* Extremely lightweight!
* Full OOP support for JavaScript
* Interfaces
* Traits / Mix-ins
* Public Class API (protected / public methods)
* Custom Plugins
* __NEW in 2.4!__ Final classes, methods & properties

# Plugins
Since JOII 2.2, plugins can be created and will be added to this list.

* [Dependency Injection](https://github.com/haroldiedema/joii-di) - Dependency Injection / Inversion of Control.
* [PlantUML Diagrams](https://github.com/haroldiedema/joii-diagram) - Generate UML diagrams for your classes.

Want your plugin here? Open an issue showcasing your plugin. Once approved, a link will be added.

Table of contents
=================
* [Installation](#installation)
* [Namespaces](#namespaces)
* [Classes](#classes)
  * [A simple class without parameters](#a-simple-class-without-parameters)
  * [Constructor](#constructor)
  * [A class constructor without arguments](#a-class-constructor-without-arguments)
  * [A class constructor with arguments](#a-class-constructor-with-arguments)
  * [Public API](#public-api)
* [Inheritance](#inheritance)
  * [A quick example](#a-quick-example)
  * [InstanceOf](#instanceof)
  * [Final classes, methods and properties](#final-classes-methods-and-properties)
* [Interfaces](#interfaces)
  * [Inheritance](#inheritance-1)
  * [Multiple interfaces](#multiple-interfaces)
  * [Extending interfaces](#extending-interfaces)
* [Traits](#traits)
  * [Multiple traits](#multiple-traits)
* [Dependency Injection](#dependency-injection)
* [Plugins](#plugins)
  * [Adding a function to any class](#adding-a-function-to-any-class)
  * [Only register plugins to classes that support it](#only-register-plugins-to-classes-that-support-it)
  * [Modify the product](#modify-the-product)
  * [Register something within the JOII-namespace](#register-something-within-the-joii-namespace)
  * [Compatibility](#compatibility)


Installation
============

Download the latest version of JOII and include it like any other javascript library:
```markup
<!DOCTYPE html>
<html>
<head>
    <script src="/path/to/joii.min.js"></script>
    <script>
    var MyClass = Class({
        // ...
    });
    </script>
</head>
</html>
```

JOII contains 3 functions: `Class`, `Interface` and `RegisterJOIIPlugin`. By default, these functions 
are injected into the global namespace, `window`. If you're running JOII on NodeJS, the `global` namespace
is used instead.

Namespaces
==========

Because the function names `Class` and `Interface` are really generic, you'll have the possibility to
use a custom namespace using the `data-ns` attribute on the `<script>` tag which you use to load JOII.
This way, you're still free to use any other library that might conflict with JOII in any way.

```markup
<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" src="/path/to/joii.min.js" data-ns="my.namespace"></script>
    <script>
    var MyClass = my.namespace.Class({
        // ...
    });
    </script>
</head>
</html>
```

Classes
=======

The `Class` function accepts 2 arguments: A _configuration object_ and the _class
body_, which is also taken as an object. The configuration object is optional and
doesn't have to be used if you don't need it.

The configuration object accepts the following parameters:
 * [extends](/documentation/inheritance)      _extending another class_
 * [implements](/documentation/interfaces)    _implementing one or more interfaces_
 * [uses](/documentation/traits)              _applying one or more traits_

A simple class without parameters
---------------------------------

```javascript
var MyClass = Class({
    helloWorld: function(name) {
        alert('Hello, ' + name);
    }
});

obj = new MyClass();
obj.helloWorld('Harold'); // Alerts: Hello, Harold.
```

Constructor
-----------

Because JOII accepts an object as class body, there is no actual function 
constructor in the tranditional sense of JavaScript. Therefore, JOII utilizes
a 'magic function', called `__construct`.

A constructor is only called on the object that's actually being instantiated.
If you with to execute the constructor of a parent class, you'll have to call
it manually using the `super` method.

You can read more about this in the [inheritance](/documentation/inheritance)
section.

A class constructor without arguments
-------------------------------------
```javascript
var MyClass = Class({
    foo: 0,
    __construct: function() {
        this.foo = 1;
    }
});

var obj = new MyClass();
alert(obj.foo); // Alerts: 1
```

A class constructor with arguments
----------------------------------
```javascript
var MyClass = Class({
    foo: 0,
    __construct: function(value1, value2) {
        this.foo = value1 + value2;
    }
});

var obj = new MyClass(10, 20);
alert(obj.foo); // Alerts: 30
```

Public API
----------

The traditional objects in javascript don't official support "protected" 
methods or properties. With JOII you can define a 'Public API' for your
class, making only a subset of the class accessible to the public.

A public API is defined by returning an object containing property names
pointing to references within the scope of the class.

```javascript

var MyClass = Class({
    
    hello: 'Hello World',
    
    __construct: function() {
        // Define the "Public API".
        return {
            getHello: this.getHello
        }
    },
    
    getHello: function() {
        return this.hello;
    }
});

var mc = new MyClass();

typeof(mc.hello); // undefined
mc.getHello(); // returns "Hello World"

```

Inheritance
===========

Classes can be extended upon other classes to a theoretically infinite depth,
as long as your browser can support it and doesn't run out of memory - so to
speak. Methods and properties in classes are inherited from parents onto 
children and may be overwritten as in most other object oriented languages.

You can specify a parent class using the `extends` property in the configuration
object which you pass to a class declaration.

> ***warning*** `extends` and `super` are actual ECMAScript keywords and are
> reserved in Internet Explorer 8 and below. You'll have to wrap them around
> quotes to be able to use it. Modern browsers don't need the quotes.

A quick example
---------------

The code below defines 3 classes: `Person`, `Employee` and `Manager`.

The inheritance tree looks like this:
* `Person`
* `Employee` &raquo; `Person`
* `Manager` &raquo; `Employee` &raquo; `Person`

The Employee class accepts a third parameter, _position_.

```javascript
var Person = Class({
    
    first_name: '',
    last_name: '',
    
    __construct: function(name, surname)
    {
        this.first_name = name;
        this.last_name = surname;
    }
});

/**
 * Employee, extending on Person. This class
 * accepts an addition argument: 'position'.
 */
var Employee = Class({ extends: Person }, {

    position: '',

    __construct: function(name, surname, position)
    {
        // "super" is an ECMAScript keyword. Wrap it around quotes to make
        // it work on older versions of Internet Explorer.
        this['super']('__construct', name, surname);
        
        // The 'modern' way:
        this.super('__construct', name, surname);
        
        this.position = position;
    }
    
});

/**
 * Manager, extending on Employee
 */
var Manager = Class({ extends: Employee }, {

    __construct: function(name, surname) {
        this.super('__construct', name, surname, 'Manager');
    }
    
});
```

InstanceOf
----------

As in many object oriented languages, checking the type of an object may be
crucial in some situations. Here's how this is done in JOII:

```javascript
var Mike = new Person('Mike', 'Salvic');
var John = new Employee('John', 'Smith', 'Analist');
var Peter = new Manager('Peter', 'Snow');

alert(Mike.instanceOf(Person)); // true
alert(Mike.instanceOf(Employee)); // false
alert(Mike.instanceOf(Manager)); // false

alert(John.instanceOf(Person)); // true
alert(John.instanceOf(Employee)); // true
alert(John.instanceOf(Manager)); // false

alert(Peter.instanceOf(Person)); // true
alert(Peter.instanceOf(Employee)); // true
alert(Peter.instanceOf(Manager)); // true
```

The method `instanceOf` also works with testing whether a class implements a certain [interface](/documentation/interfaces).

Final classes, methods and properties
-------------------------------------

Since JOII 2.4, any class may define a set of final methods or properties or declare itself as a whole as a final class.
When a class is marked as final, it cannot be used as a parent class for anything.

The `final` parameter has 2 possible options:
* (bool) true - Makes the entire class final - equivalent of PHP or Java: `final class Foobar { ... }`.
* (array) methods - Define an array with names of properties/methods that must be final.

__Making a final class:__
```javascript
var MyClass = Class({ final: true }, { /* class body */ });

// This will throw an exception stating that extending on MyClass is impossible
// because it's marked as 'final'.
var AnotherClass = Class({ extends: MyClass }, {
    // ...
});
```

__Making a set of methods & properties final__
```javascript:
var MyClass = Class({ final: ['__construct', 'foobar'] }, {
    __construct: function() {
        // I may not be overwritten by any child class.
    },
    
    foobar: 'Me neither...'
});

var AnotherClass = Class({ extends: MyClass }, {
    __construct: function() {
        // An exception is thrown. Overriding __construct is forbidden.
    },
    
    // The same applies to overriding this property:
    foobar: 'Exception is now thrown...'
});
```

Interfaces
==========

An interface defines the behaviour of a class by defining which properties and
methods a class **must** implement. The body of an interface is always defined
as an _object_ and contains properties with values indicating the desired 
types.

```javascript
var IPerson = Interface({
    first_name: 'string',
    last_name: 'string',
    
    getFullName: 'function'
});
```

When implementing an interface on a class, an exception is thrown as soon as 
the class is instantiated while it's missing properties.
```javascript
var Person = Class({ implements: IPerson }, {
});

var p = new Person();
// Throws an error indicating that certain implementations are missing.
```

The same will happen when a class implements properties, but of the wrong type.

```javascript
var Person = Class({ implements: IPerson }, {
    first_name: '',
    last_name: 0, // <- yeah, this is wrong.

    getFullName: function() {
        return this.first_name + ' ' + this.last_name;
    }
});

var p = new Person();
// Throws an error about a property type mismatch.
```

> ***warning*** `implements` is an actual ECMAScript keyword and is
> reserved in Internet Explorer 8 and below. You'll have to wrap it around
> quotes to be able to use it. Modern browsers don't need the quotes.

Inheritance
-----------

You can implement an interface on a base class to enforce a child class to
implement certain properties.

```javascript
var BasePerson = Class({ implements: IPerson }, {
    first_name: 'Some',
    last_name: 'Person'
});

var SomePerson = Class({ extends: BasePerson }, {
    // getFullName is mandatory as defined in interface IPerson. Not 
    // implementing it results in a missing-property exception.
    getFullName: function() {
        return this.first_name + ' ' + this.last_name; 
    }
});

var a = new SomePerson();

a.instanceOf(SomePerson); // true
a.instanceOf(BasePerson); // true
a.instanceOf(IPerson); // true
```

Multiple interfaces
-------------------

Multiple interfaces can be implemented on one class. The `implements` property
may accept an array of interfaces instead of just one.

```javascript
var ILogger = Interface({
    log: 'function'
});

var SomePerson = Class({ implements: [IPerson, ILogger] }, {
    // ...
});
```

Extending interfaces
--------------------

Interfaces can be extended, the same way as classes.

```javascript
var SomeInterface = Interface({
    log: 'function'
});

var AnotherInterface = Interface({ extends: SomeInterface }, {
    someFunction: 'function'
});
```
Any class implementing `AnotherInterface` must now implement the methods `log` and `someFunction`.

Credits for this implementation to @georgePadolsey.


Traits
======

A trait serves as a mix-in for classes to provide additional, generic, functionality.
You can implement a trait using the `uses` property in the configuration object.

Because the nature of a trait is stateless, the trait **must** always be an *object*.

```javascript
var MathTrait = {
    add: function(a, b) {
        return a + b;
    }
}

var MyClass = Class({ uses: MathTrait }, {
    __construct: function(a, b) {
        alert(this.add(a, b));
    }
});

var m = new MyClass(10, 20); // alerts: 30
```

Multiple traits
---------------

Just as interfaces, traits can also be implemented with more than once.

```javascript
var LogTrait = {
    log: function(msg) {
        console.log(msg);
    }
}

var MyClass = Class({ uses: [MathTrait, LogTrait] }, {
    // ...
});
```

Dependency Injection
====================

### This feature was deprecated as of version 2.2, removed in version 2.3. Please use the [JOII-DI](https://github.com/haroldiedema/joii-di) package instead.

Plugins
=======

Plugins allow you to fully extend the functionality of JOII by dynamically
injecting properties into the scope of any created class or even recompile
the product (the class prototype) before instantiation.

A plugin is registered using the `RegisterJOIIPlugin` function. This
function accepts 2 parameters: A _name_ and a _configuration object_.

The configuration object takes 3 properties:

* scope _An object containing properties which are injected into the class_
* supports _A function which returns true if the plugin supports the class_
* compile _A function which takes the product as argument and returns it as well, allowing modification._

Adding a function to any class.
-------------------------------

The `scope` property defines an object. The contents of this object is injected
into the created classes.

```javascript
RegisterJOIIPlugin('my-plugin', {
    scope: {
        helloWorld: function() {
            return 'Hello World';
        }
    }
});

var MyClass = Class({});

var m = new MyClass();
m.helloWorld(); // Hello World
```

Only register plugins to classes that support it
------------------------------------------------

The `supports` method returns a boolean indicating whether to register the 
plugin or not. This method has one argument which represents the product.

```javascript
RegisterJOIIPlugin('my-plugin', {
    
    // Only register the plugin to classes that have a method called 'getFullName'.
    supports: function(product) {
        return typeof(product.prototype.getFullName) === 'function';
    },
    scope: {
        helloWorld: function() {
            return this.getFullName();
        }
    }
});
```

Modify the product
------------------

The compile function takes one argument which represents the product. The
product is the class being built by the internal ClassBuilder before it's
being returned by the `Class()` function.

In the example below, we'll check if a class has a constructor. If it does,
rename it and create our own as a 'proxy'. Our new constructor is called 
first, then we'll call the original constructor.

```javascript
RegisterJOIIPlugin('my-plugin', {
    compile: function(product) {
        // Modify the constructor of the product.
        if (typeof(product.prototype.__construct) === 'function') {
            product.prototype.__construct2 = product.prototype.__construct;
            product.prototype.__construct = function() {
                alert('Constructor has been called!');
                return this.__construct2.apply(this, arguments);
            };
        }
        return product;
    }
});

var MyClass = Class({
    __construct: function(a) {
        alert(a);
    }
});

var m = new MyClass('Hello');
// Constructor has been called!
// Hello
```

Register something within the JOII-namespace
--------------------------------------------

Since JOII 2.2, it's now possible to add "external" plugins which operate as
a completely separate "project" but will be registered inside the JOII-namespace.

For example, if you configured JOII to be registered in the `HelloWorld`
namespace and you define classes like `var MyClass = HelloWorld.Class({ /* ... */ });`,
it's now possible for external classes to also be registered in the `HelloWorld`
namespace using the following snippet:

JOII would be loaded like this:
```markup
<script src="js/joii.min.js" data-ns="HelloWorld"></script>
```

```javascript
_g.$JOII.RegisterInNS('Something', _g.$JOII.PublicAPI.Class({
    // Your class code here...
});

// If namespace = HelloWorld:
var something = new HelloWorld.Something();
```

A use-case example of this feature is the diagram plugin, found at
<https://github.com/haroldiedema/joii-diagram>.

Compatibility
-------------

Because multiple plugins may be registered, some properties might be added to a
class scope which are also implemented by other plugins. If this happens, an
exception is thrown indicating a certain property is already created by another
plugin.

When a plugin creates a property into a class scope, that class is unable to 
override this property. This will result in an exception indicating the property
name is reserved by a cartain plugin.

Here's a quick example where it goes wrong:
```javascript
RegisterJOIIPlugin('my-plugin', {
    scope: {
        test: function() {}
    }
});

RegisterJOIIPlugin('another-plugin', {
    scope: {
        test: function() {}
    }
});

// Error: Error: Method "test" from plugin "another-plugin" is already in use by plugin "my-plugin". 
```

Imagine the scenario where 'my-plugin' is registered correctly and the method `test`
will be injected into the scope of a class. See what happens when the class tries
to implement the method `test`.

```javascript
var MyClass = Class({
    test: function() {}
});

// Error: Method "test" is reserved by plugin "my-plugin".
```

