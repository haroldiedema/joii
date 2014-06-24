# Changelog

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
