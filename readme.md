# JOII has been updated to 2.0

A lot has changed and 2.0 is not backwards compatible with 1.0. If you still wish to use
the old version, please use the 1.0 tag.

Check out the [website](http://joii.harold.info/) for examples and documentation.

# Features

* Extremely lightweight!
* Full OOP support for JavaScript
* Supports Internet Explorer 5 and up
* Interfaces
* Traits / Mix-ins
* Custom Plugins

[http://joii.harold.info/](http://joii.harold.info/)

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
