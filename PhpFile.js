var grammar = require(__dirname + "/grammar.js");
var templates = require(__dirname + "/templates.js");
var _ = require('lodash');
var microparser = require('microparser');
var $ = microparser.$;

/**
 * Represents a PHP script.
 *
 * @param code {string} - The initial code.
 * @param $root {cheerio} - The initial DOM element.
 * @constructor
 */
function PhpFile(code, $root) {
    var that = this;

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

    ////////////////////////////////////// Doc //////////////////////////////////////
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

    function createDoc($newDoc) {
        that.get$root().find(">start").first().after(["\n", $newDoc]);
    }

    function deleteDoc($doc) {
        $doc.removePreviousText();
        $doc.remove();
    }

    ////////////////////////////////////// Namespace //////////////////////////////////////
    that.getNamespace = function () { // TODO
        var $namespace = that.get$root().find(">namespace");
        return ($namespace.length > 0 ? $namespace.text() : null);
    };

    that.setNamespace = function (namespace) { // TODO
        var $namespace = that.get$root().find(">namespace");

        // Removal
        if (!namespace) {
            if ($namespace.length) deleteNamespace($namespace);
            return that;
        }

        var $newNamespace = microparser.parse(namespace, grammar.undefined);

        // Creation
        if (!$namespace.length) {
            createNamespace($newNamespace);
            return that;
        }

        // Update
        $namespace.replaceWith($newNamespace);
        return that;
    };

    function createNamespace($newNamespace) {
        that.get$root().find(">TODO").after([" = ", $newNamespace]); // TODO
    }

    function deleteNamespace($namespace) {
        $namespace.removePreviousText(); // TODO
        $namespace.remove();
    }

    ////////////////////////////////////// Uses //////////////////////////////////////
    // TODO stringArray concepts

    ////////////////////////////////////// Class //////////////////////////////////////
    that.getClass = function () { // TODO
        var $class = that.get$root().find(">class");
        if (!$class.length) return null;
        return new PhpClass(undefined, $class);
    };

    that.setClass = function (class_) { // TODO
        var $class = that.get$root().find(">class");

        // Removal
        if (!class_) {
            if ($class.length) deleteClass($class);
            return that;
        }

        var $newClass = class_.get$root();

        // Creation
        if (!$class.length) {
            createClass($newClass);
            return that;
        }

        // Update
        $class.replaceWith($newClass);
        return that;
    };

    function createClass($newClass) {
        that.get$root().find(">TODO").after([" = ", $newClass]); // TODO
    }

    function deleteClass($class) {
        $class.removePreviousText(); // TODO
        $class.remove();
    }


    ////////////////////////////////////// Initialization //////////////////////////////////////
    if (code) that.setCode(code);
}
