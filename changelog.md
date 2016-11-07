# Changelog

## 4.0.0
- JOII is now a proper AMD/CommonJS Module
- No more global scope leaking in node environments (can still be done on-demand using `useGlobal()`)
- Replaced build-tool grunt (concat & uglify-js) with [ISC](https://npmjs.com/packages/isc/).

## 3.2.0
- Added serialization support (by cjmanca)
- Fixed scope leaking by generated setters

## 3.1.0 ~ 3.1.5
- Various bugfixes: Proper inheritance through multiple levels of parent classes, interface reference issues fixed

## 3.1.0
- Custom constructor methods. You can now use your own constructor method instead of the default `__construct`.
- Custom callable methods. Same as constructors, but apply to the __call method (call class as a function).

## 3.0.7
- Fixed issue #10

## 3.0.6
- More IE8 (and below) compatibility fixes

## 3.0.5
- Various IE8 (and below) compatibility fixes

## 3.0.4
- Fixed initializr casing

## 3.0.3
- Various bug- and codestyle fixes

## 3.0.2
- Added `JOII.isInstance()` to verify if an object is an instance of a JOII class.

## 3.0.1
- Added fluid interfacing support. `this.__api__` returns the public scope of an instance.

## 3.0
- Properties are now always private
- Getter/Setter generation
- Added type support
- Added constants
- Added Enum-types
- Enhanced visibility for properties and methods
- Various bugfixes
- Improved performance
- Reworked the entire codebase
- Using grunt & npm for unit testing and deployment

The following features have been removed / relocated:
- `final` parameter only accepts boolean "true", properties are defined `final` on the property declaration directly.
- Removed the "Public API" feature to define public methods using a return value from the constructor
- Removed support for plug-ins, as they are a potentional security breach and can easily mess up class definitions.

## 2.4
- Added the `final` parameter to mark a class or a set of properties _final_.

## 2.3
- __IMPORTANT__ Removed builtin DependencyInjection. Please use the [Dependency Injection](https://github.com/haroldiedema/joii-di) package 

## 2.2.1
- Added the ability to extend interfaces.

## 2.2
- Added plugin support, allowing classes to be registered within the JOII-namespace.

## 2.1.6
- Small optimizations (removed redeclarations of variables)
- Renamed "arguments" to "args" as "arguments" is a reserved keyword (d'oh)

## 2.1.5
- Bugfix: Prototype (the framework) was messing up the registered interfaces list by injecting undefined elements to the interfaces array. The implementation check-mechanism now skips "undefined" variables.
- Optimization: V8 was unable to optimize certain internal functions.

## 2.1.4
- Bugfix: Interfaces & plugins weren't properly applied when a public class API was defined.

## 2.1.3
- Minor bugfixes

## 2.1.2
- Polished public API support
- Fixed an issue where objects remained static from parent classes (related to issue #4)

## 2.1.1
- Fixed issue #4
- Polished dependency injection support (dropped the 'injects' parameter from class declarations)

## 2.1
### Added Public API support
Make a subset of a class available to the public while keeping the rest 'protected' by returning an object from
the class constructor. Check out the last section of the page at http://joii.harold.info/documentation/classes 
for an example.

### Dependency Injection support
Added a feature to register classes as services. For more information about dependency injection, some folks
at stackoverflow can provide you with some nice answers: http://stackoverflow.com/questions/130794/what-is-dependency-injection

## 2.0
- Reworked entire library, only objects are accepted as function bodies to enforce code structure and reliability.

## 1.0
- Initial release of JOII.
