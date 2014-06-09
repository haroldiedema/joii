# Changelog

## 1.0
- Initial release of JOII.

## 2.0
- Reworked entire library, only objects are accepted as function bodies to enforce code structure and reliability.

## 2.1
### Added Public API support
Make a subset of a class available to the public while keeping the rest 'protected' by returning an object from
the class constructor. Check out the last section of the page at http://joii.harold.info/documentation/classes 
for an example.

### Dependency Injection support
Added a feature to register classes as services. For more information about dependency injection, some folks
at stackoverflow can provide you with some nice answers: http://stackoverflow.com/questions/130794/what-is-dependency-injection
