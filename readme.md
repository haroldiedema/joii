#JOII#
###Javascript Object Inheritance Implementation###

-----

I've seen lots of attempts from people trying to create a way of implementing object inheritance in javascript, but rarely see anything successful, unless it's bloated with an entire framework. If you're looking for a minimalistic, you came to the right place.

## Features ##

* Lightweight! (2kb minified)
* Extending native and JOII-classes.
* Overrides & parent inheritance
* Using interfaces, making sure a class contains the functionality you need.
* Using traits, get rid of horizontal code duplication.

Check out the examples below for the possibilities.

## Inheritance ##

### Example 1: Simple inheritance ###

Lets start by declaring a simple "base" class. This could be anything, ranging from a simple function to something large like the WebGL renderer of THREE.js ;)
```javascript
var BaseClass = function() 
{
    this.some_var = "foobar";
    
    /**
     * @return string
     */
    this.someMethod = function() {
        return this.some_var;
    }
};
```
Assuming you have basic knowledge of javascript, or any programming language in that matter, the code above should be simple enough to understand.

Lets move on to a class declaration that's going to **extend** on this class.
```javascript
var MyClass = new Class({ extends: BaseClass }, function()
{
    /**
     * @param string value
     */
    this.__construct = function(value)
    {
        this.some_var = value;
    }
    
})
```

As soon as the class in this example is going to be instantiated, it'll overwrite the property `some_var` with the value you're going to give it. If you then execute the method `someMethod`, it'll return the new value instead of "foobar".

Here's how:
```javascript
var example = new MyClass("Another value!");
console.log( example.someMethod() );
```

Easy stuff right?

### Example 2: Nested inheritance ###

Lets move on to something a little more intermediate. We'll create 2 *base* classes, and 1 normal class. The second base class is going to override an existing method, but still use the functionality from its parent.

```javascript
// Note that the parameters argument isn't required if you don't need it.
var BaseClass = new Class(function()
{
    /**
     * @return string
     */
    this.getText = function()
    {
        return "This is a text which we'll display completely capitalized.";
    }
});

var SecondBaseClass = new Class({ extends: BaseClass }, function()
{
    /**
     * @see BaseClass.getText
     */
    this.getText = function()
    {
        return this.parent.getText().toUpperCase();
    }
});

var MyClass = new Class({ extends: SecondBaseClass }, function()
{
    this.__construct = function()
    {
        // Prints: THIS IS A TEXT WHICH WE'LL DISPLAY COMPLETELY CAPITALIZED.
        console.log( this.getText() );
    }
})

// instantiate the class.
new MyClass();
```

## Interfaces ##
Ever wanted to make sure a certain object contains functionality that you need? JOII gives you the possibility to implement so-called "interfaces". An interface in this way is only an object containing a set of properties that the class **must** implement. If it does not, an exception is thrown. Once an object implements a certain object, simply use the `implements()` method to check if it has the functionality you seek.

### Example: A simple interface usecase ###

```javascript
var iUser = {
    // Note that types are checked, but functionality isn't used. Simply use empty function body.
    getUsername: function() {}
}

var iLoggable = {
    log: function(msg) {}
}

var MyClass = new Class({ implements: [iUser]}, function()
{
    this.getUsername = function() {
        return 'user';
    }    
});

var example = new MyClass();

example.implements(iUser); // true
example.implements(iLoggable); // false


if (example.implements(iUser)) {
    console.log( example.getUsername() ); // prints: user
}
```

## Traits ##
JOII allows you to implement ***traits***. A trait is simply an object which will have its functionality copied into the designated class. The difference between extending a class or using it as a trait it basically the way that the trait is stateless. Think of copy-pasting code from one class to another, so you don't have to create code duplication across your project.

### Example: a simple way of using traits ###

```javascript
var tLogger = {    
    log   : function(msg) { console.log(msg); },
    warn  : function(msg) { console.warn(msg); },
    error : function(msg) { console.error(msg); }
}
var tMath = {
    add : function(a, b) { return a + b; },
    sub : function(a, b) { return a - b; }
}

var MyClass = new Class({ using: [tLogger, tMath] }, function()
{
    this.__construct = function()
    {
        this.log('2 + 5 = ' + this.add(2, 5));
    }
});
```


## Everything combined ##

Lets combine everything we've been going through so far into one working example. How about we create some sort of object storage in combination with a user object. 

We're going to start by defining some base class on which we'll extend our functionality.

```javascript
var ObjectStorage = function()
{
    this.storage = {};
    
    this.set = function(key, value) {
        this.storage[key] = value;
    }
    
    this.get = function(key, default) {
        return this.storage[key] || default;
    }
}
```

Moving on to some interfaces. Afterall, we want to make sure we're dealing with an actual "user" object that contains the functionality we eventually need...

```javascript
var iUser = {
    getUsername    : function(){},
    getDisplayname : function(){}
};

var iLoggable = {
    log : function(msg){}
};
```

And a simple logger trait that lets us...erm... log things.
```javascript
var tLogger = {
    log: function(msg) {
        console.log(msg);
    }
};
```

And the final product.

* We ***extend*** on `ObjectStorage`.
* We ***implement*** the functionality definition of `iUser` and `iLoggable`.
* We ***use*** the functionality of the trait `tLogger`.

Note that once binding the interface `iLoggable` to this class, the definition rule is directly solved because we're injecting the required functionality using the trait `tLogger`.


```javascript
var User = new Class({extends: ObjectStorage, implements: [iUser, iLoggable], using: [tLogger]}, function() {

    this.__construct = function(username, displayname)
    {
        this.set('username', username);
        this.set('displayname', displayname);
    }

   this.getUsername = function()
   {
       this.log('Requested username');
       return this.get('username');
   }
   
   this.getDisplayname = function()
   {
       this.log('Requested displayname');
       return this.get('displayname');
   }
   
});
```

Final usage:
```javascript
var person = new User('harold', 'Harold Iedema');

if (person.implements(iUser) && person.implements(iLoggable)) {
    person.log(person.getDisplayname());
}
```
