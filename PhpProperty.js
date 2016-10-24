var grammar = require(__dirname + "/grammar.js");
var templates = require(__dirname + "/templates.js");
var microparser = require('microparser');

/**
 * Represents a PHP class property.
 * @param code {string} - The initial code.
 * @param $root - The initial DOM element.
 * @constructor
 */
function PhpProperty(code, $root) {
    var that = this;

    /**
     * Sets this node code.
     * @param code
     */
    that.setCode = function (code) {
        $root = microparser.parse(code, grammar.property);
    };

    that.get$root = function () {
        if (!$root) that.setCode(templates.property);
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
        return that.get$root().find(">variable>name").text();
    };

    that.setName = function (name) {
        that.get$root().find(">variable>name").text(name);
        return that;
    };

    ////////////////////////////////////// Visibility //////////////////////////////////////
    that.getVisibility = function () {
        var $visibility = that.get$root().find(">visibility");
        return ($visibility.length ? $visibility.text() : "public");
    };

    that.setVisibility = function(visibility) {
        var $visibility = that.get$root().find(">visibility");

        // Removal
        if (!visibility) {
            if($visibility.length) deleteMarker($visibility);
            return that;
        }

        var $newVisibility = microparser.parse(visibility, grammar.visibility);

        // Creation
        if(!$visibility.length) {
            createVisibility($newVisibility);
            return that;
        }

        // Update
        $visibility.replaceWith($newVisibility);
        return that;
    };

    function createVisibility($newVisibility) {
        that.get$root().find(">variable,>static,>abstract").first().before([
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

    that.setStatic = function(static_) {
        var $static = that.get$root().find(">static");

        // Removal
        if (!static_) {
            if($static.length) deleteMarker($static);
            return that;
        }

        var $newStatic = microparser.parse("static", grammar.static);

        // Creation
        if(!$static.length) {
            createStatic($newStatic);
            return that;
        }
    };

    function createStatic($newStatic) {
        that.get$root().find(">variable,>abstract").first().before([$newStatic, " "]);
    }

    ////////////////////////////////////// Initialization //////////////////////////////////////
    if (code) that.setCode(code);
}

module.exports = PhpProperty;

