var grammar = require(__dirname + "/grammar.js");
var templates = require(__dirname + "/templates.js");
var PhpDoc = require(__dirname + "/PhpDoc.js");
var PhpFunctionArgument = require(__dirname + "/PhpFunctionArgument.js");
var _ = require('lodash');
var microparser = require('microparser');
var $ = microparser.$;

/**
 * Represents a PHP class method.
 * @param code {string} - The initial code.
 * @param $root - The initial DOM element.
 * @constructor
 */
function PhpMethod(code, $root) {
    var that = this;
    var indentation = "    ";

    /**
     * Sets this node code.
     * @param code
     */
    that.setCode = function (code) {
        $root = microparser.parse(code, grammar.method);
    };

    that.get$root = function () {
        if (!$root) that.setCode(templates.method);
        return $root;
    };

    /**
     * Returns the code.
     * @return {string}
     */
    that.getCode = function () {
        return that.get$root().text();
    };

    ////////////////////////////////////// Name //////////////////////////////////////
    that.getName = function () {
        return that.get$root().find(">name").text();
    };

    that.setName = function (name) {
        that.get$root().find(">name").text(name);
        return that;
    };

    ////////////////////////////////////// Visibility //////////////////////////////////////
    that.getVisibility = function () {
        var $visibility = that.get$root().find(">visibility");
        return ($visibility.length ? $visibility.text() : "public");
    };

    that.setVisibility = function (visibility) {
        var $visibility = that.get$root().find(">visibility");

        // Removal
        if (!visibility) {
            if ($visibility.length) deleteMarker($visibility);
            return that;
        }

        var $newVisibility = microparser.parse(visibility, grammar.visibility);

        // Creation
        if (!$visibility.length) {
            createVisibility($newVisibility);
            return that;
        }

        // Update
        $visibility.replaceWith($newVisibility);
        return that;
    };

    function createVisibility($newVisibility) {
        that.get$root().find(">static,>abstract,>function").first().before([
            $newVisibility, " "
        ]);
    }

    function deleteMarker($marker) {
        $marker.removeNextText();
        $marker.remove();
    }

    ////////////////////////////////////// Static //////////////////////////////////////
    that.isStatic = function () {
        return (that.get$root().find(">static").length > 0);
    };

    that.setStatic = function (static_) {
        var $static = that.get$root().find(">static");

        // Removal
        if (!static_) {
            if ($static.length) deleteMarker($static);
            return that;
        }

        var $newStatic = microparser.parse("static", grammar.static);

        // Creation
        if (!$static.length) {
            createStatic($newStatic);
            return that;
        }
    };

    function createStatic($newStatic) {
        that.get$root().find(">function").first().before([$newStatic, " "]);
    }

    ////////////////////////////////////// Abstract //////////////////////////////////////
    that.isAbstract = function () {
        return (that.get$root().find(">abstract").length > 0);
    };

    that.setAbstract = function (abstract_) {
        var $abstract = that.get$root().find(">abstract");

        // Removal
        if (!abstract_) {
            if ($abstract.length) deleteMarker($abstract);
            return that;
        }

        var $newAbstract = microparser.parse("abstract", grammar.abstract);

        // Creation
        if (!$abstract.length) {
            createAbstract($newAbstract);
            return that;
        }
    };

    function createAbstract($newAbstract) {
        that.get$root().find(">static,>function").first().before([$newAbstract, " "]);
    }

    ////////////////////////////////////// PhpDoc //////////////////////////////////////
    that.getDoc = function () {
        var $doc = that.get$root().find(">doc");
        if (!$doc.length) return null;
        return new PhpDoc(undefined, $doc);
    };

    that.setDoc = function (doc) {
        var $doc = that.get$root().find(">doc");

        // Removal
        if (!doc) {
            if ($doc.length) deleteDoc($doc);
            return that;
        }

        var $newDoc = doc.get$root();

        // Creation
        if (!$doc.length) {
            createDoc($newDoc);
            return that;
        }

        // Update
        $doc.replaceWith($newDoc);
        return that;
    };

    function deleteDoc($doc) {
        $doc.removeNextText();
        $doc.remove();
    }

    function createDoc($newDoc) {
        that.get$root().find(">visibility,>static,>abstract,>function").first().before([$newDoc, "\n"]);
    }

    ////////////////////////////////////// Arguments //////////////////////////////////////
    that.getArguments = function () {
        var $arguments = that.get$root().find(">args>arg");
        return $arguments.toArray()
            .map(function (node) {
                return new PhpFunctionArgument(null, $(node));
            });
    };

    that.findArgumentByName = function (name) {
        var $arguments = that.get$root().find(">args>arg").filter(function () {
            return $(this).find(">variable>name").text() === name;
        });

        if (!$arguments.length) return null;
        return new PhpFunctionArgument(null, $arguments.first());
    };

    that.addArgument = function (argument, previousArgument) {
        var $method = that.get$root();
        var $argument = argument.get$root();

        if ($.contains($method, $argument) && previousArgument === undefined) return; // Already added.
        var $args = $method.find(">args");
        var $arguments = $args.find(">arg");

        // We look for the previous node.
        var $previousNode = null;
        if (previousArgument === null || $arguments.length === 0) $previousNode = null; // First argument
        else if (previousArgument !== undefined) $previousNode = previousArgument.get$root(); // After the given argument
        else {
            // We have to find the previous argument.
            var argumentsNodes = $arguments.toArray();
            var newNode = $argument[0];
            argumentsNodes.push(newNode);

            var sortedArgumentsNodes = argumentsNodes.sort(function (a, b) {
                // Sorted by name.
                return $(a).find(">name").text().localeCompare($(b).find(">name").text());
            });

            var index = _.findIndex(sortedArgumentsNodes, function (node) {
                return node === newNode;
            });

            if (index > 0) $previousNode = $(sortedArgumentsNodes[index - 1]);
            else $previousNode = null; // First position.
        }

        if ($previousNode) $previousNode.after(", ", $argument);
        else {
            $args.prepend($argument);
            if ($argument.next().length > 0) $argument.after(", ");
        }

        return that;
    };

    that.removeArgument = function (argument) {
        var $argument = argument.get$root();
        var $previous = $argument.prev();
        var $next = $argument.next();
        $argument.removePreviousText();
        $argument.removeNextText();
        if ($previous.length && $next.length) $argument.before(", ");
        $argument.remove();
    };

    ////////////////////////////////////// Implementation //////////////////////////////////////
    that.getImplementation = function () {
        var $implementation = that.get$root().find(">body>implementation");
        return $implementation.length ? $implementation.text() : null;
    };

    that.setImplementation = function (implementation) {
        var $implementation = that.get$root().find(">body>implementation");

        // Removal
        if (!implementation) {
            if ($implementation.length > 0) deleteImplementation($implementation);
            return that;
        }

        var $newImplementation = microparser
            .parse(implementation, grammar.funcImplementation)
            .indent(indentation);

        // Creation
        if (!$implementation.length) {
            createImplementation($newImplementation);
            return that;
        }

        // Update
        $implementation.replaceWith($newImplementation);
        return that;
    };

    function deleteImplementation($implementation) {
        $implementation.parent().empty().text(";");
    }

    function createImplementation($newImplementation) {
        that.get$root().find(">body").empty().append(["\n{\n" + indentation, $newImplementation, "\n}"]);
    }

    ////////////////////////////////////// Initialization //////////////////////////////////////
    if (code) that.setCode(code);
}

module.exports = PhpMethod;

