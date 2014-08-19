# JOII has been updated to 2.2

A lot has changed and 2.* is not backwards compatible with 1.0. If you still wish to use
the old version, please use the 1.0 tag.

The official website can be visited at [joii.zone](http://joii.zone/)

# Features

* ***Dependency Injection***
* ***Supports Internet Explorer 5 and up***
* Extremely lightweight!
* Full OOP support for JavaScript
* Interfaces
* Traits / Mix-ins
* Public Class API (protected / public methods)
* Custom Plugins

Check out [joii.zone/documentation](http://joii.zone/documentation/installation) for documentation and examples.

# Plugins
Starting from JOII 2.2, plugins can be created and will be added to this list.

* [JOII Diagram](https://github.com/haroldiedema/joii-diagram) - Generate UML diagrams for your classes.
 
Want your plugin here? Open an issue showcasing your plugin. Once approved, a link will be added here.

# Installation

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

# Namespaces

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

# Classes

The `Class` function accepts 2 arguments: A _configuration object_ and the _class
body_, which is also taken as an object. The configuration object is optional and
doesn't have to be used if you don't need it.

The configuration object accepts the following parameters:
 * [extends](/documentation/inheritance)      _extending another class_
 * [implements](/documentation/interfaces)    _implementing one or more interfaces_
 * [uses](/documentation/traits)              _applying one or more traits_

### Example: A simple class without parameters

```javascript
var MyClass = Class({
    helloWorld: function(name) {
        alert('Hello, ' + name);
    }
});

obj = new MyClass();
obj.helloWorld('Harold'); // Alerts: Hello, Harold.
```

# Constructor

Because JOII accepts an object as class body, there is no actual function 
constructor in the tranditional sense of JavaScript. Therefore, JOII utilizes
a 'magic function', called `__construct`.

A constructor is only called on the object that's actually being instantiated.
If you with to execute the constructor of a parent class, you'll have to call
it manually using the `super` method.

You can read more about this in the [inheritance](/documentation/inheritance)
section.

### Example: A class constructor without arguments

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

### Example: A class constructor with arguments

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

## Public API

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

# Inheritance

Classes can be extended upon other classes to a theoretically infinite depth,
as long as your browser can support it and doesn't run out of memory - so to
speak. Methods and properties in classes are inherited from parents onto 
children and may be overwritten as in most other object oriented languages.

You can specify a parent class using the `extends` property in the configuration
object which you pass to a class declaration.

> ***warning*** `extends` and `super` are actual ECMAScript keywords and are
> reserved in Internet Explorer 8 and below. You'll have to wrap them around
> quotes to be able to use it. Modern browsers don't need the quotes.

## A quick example

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

# InstanceOf

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

# Interfaces
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

# Inheritance

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

# Multiple interfaces

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

# Extending interfaces

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


# Traits
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

# Multiple traits

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

# Dependency Injection

JOII allows you to register a class as a service.

For more information about dependency injection, please check out this article
by Martin Fowler, the "inventor" of this design pattern: http://martinfowler.com/articles/injection.html

A service is registered using the `Service` function.

```javascript
// The following class simply holds 2 variables and returns the
// sum of them in the getValue() method.
var SomeServiceClass = Class({

    some_value: null,
    another_value: null,

    __construct: function(some_value, another_value) {
        this.some_value = some_value;
        this.another_value = another_value;
    }
    
    this.getValue = function() {
        return this.some_value + this.another_value;
    }
});

// Register the "SomeServiceClass"-class as 2 different services:
Service("my_first_service", SomeServiceClass, {
    some_value: 1,
    another_value: 2
});

Service("my_second_service", SomeServiceClass, {
    some_value: 2,
    another_value: 4
});

// We're going to use these services in the following class:
var MyClass = Class({ injects: { 
    serivce1: "my_first_service",  // Name of the service
    service2: "my_second_service"  // Name of the service
}}, {
    __construct: function() {
        console.log(this.service1.getValue()); // prints: 3
        console.log(this.service2.getValue()); // prints: 6
    }
});


// Create a service that depends on the first two services we already have:
var DependencyClass = Class({
    __construct: function(a, b, c) {
        console.log(a.getValue() + b.getValue() + c); // prints: 10
    }
});

// If a value is prefixed with an @ [at-sign], it's pointing to a service.
Service('dependency_class', DependencyClass, {
    a: '@my_first_service',
    b: '@my_second_service',
    c: 1 // Just a random value
});
```

# Plugins

Plugins allow you to fully extend the functionality of JOII by dynamically
injecting properties into the scope of any created class or even recompile
the product (the class prototype) before instantiation.

A plugin is registered using the `RegisterJOIIPlugin` function. This
function accepts 2 parameters: A _name_ and a _configuration object_.

The configuration object takes 3 properties:

* scope _An object containing properties which are injected into the class_
* supports _A function which returns true if the plugin supports the class_
* compile _A function which takes the product as argument and returns it as well, allowing modification._

## "scope" - Adding a function to any class.

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

## "supports" - Only register plugins to classes that 'support' it.

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

## "compile" - Modify the product

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

## Register something within the JOII-namespace

Since JOII 2.2, it's now possible to add "external" plugins which function as
a completely separate "project" but will be registered inside the JOII-namespace.

For example, if you configured JOII to be registered in the `HelloWorld`
namespace and you define classes like `var MyClass = HelloWorld.Class({ /* ... */ });`,
it's now possible for external classes to also be registered in the `HelloWorld`
namespace using the following snippet:

```javascript
_g.$JOII.RegisterInNS('Something', _g.$JOII.PublicAPI.Class({
    // Your class code here...
});

// If namespace = HelloWorld:
var something = new HelloWorld.Something();
```

A use-case example of this feature is the diagram plugin, found at
<https://github.com/haroldiedema/joii-diagram>.

# Compatibility

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


