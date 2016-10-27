var grammar = require(__dirname + "/grammar.js");
var templates = require(__dirname + "/templates.js");
var PhpDoc = require(__dirname + "/PhpDoc.js");
var _ = require('lodash');
var microparser = require('microparser');
var $ = microparser.$;

/**
 * Represents a PHP class.
 * @param code {string} - The initial code.
 * @param $root - The initial DOM element.
 * @constructor
 */
function PhpClass(code, $root) {
    var that = this;
    var indentation = "    ";

    /**
     * Sets this node code.
     * @param code
     */
    that.setCode = function (code) {
        $root = microparser.parse(code, grammar.class);
    };

    that.get$root = function () {
        if (!$root) that.setCode(templates.class);
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
        that.get$root().find(">kind").before([$newAbstract, " "]);
    }

    function deleteMarker($marker) {
        $marker.removeNextText();
        $marker.remove();
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
        that.get$root().find(">abstract,>class").first().before([$newDoc, "\n"]);
    }

    ////////////////////////////////////// Initialization //////////////////////////////////////
    if (code) that.setCode(code);
}

module.exports = PhpClass;

