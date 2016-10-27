var grammar = require(__dirname + "/grammar.js");
var templates = require(__dirname + "/templates.js");
var PhpDoc = require(__dirname + "/PhpDoc.js");
var microparser = require('microparser');

/**
 * Represents a PHP class constant.
 * @param code {string} - The initial code.
 * @param $root - The initial DOM element.
 * @constructor
 */
function PhpConstant(code, $root) {
    var that = this;

    /**
     * Sets this node code.
     * @param code
     */
    that.setCode = function (code) {
        $root = microparser.parse(code, grammar.constant);
    };

    that.get$root = function () {
        if (!$root) that.setCode(templates.constant);
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

    ////////////////////////////////////// PhpDoc //////////////////////////////////////
    that.getDoc = function () {
        var $doc = that.get$root().find(">doc");
        if (!$doc.length) return null;
        return new PhpDoc(undefined, $doc);
    };

    that.setDoc = function(doc) {
        var $doc = that.get$root().find(">doc");

        // Removal
        if (!doc) {
            if($doc.length) deleteDoc($doc);
            return that;
        }

        var $newDoc = doc.get$root();

        // Creation
        if(!$doc.length) {
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
        that.get$root().find(">const").before([$newDoc, "\n"]);
    }

    ////////////////////////////////////// Value //////////////////////////////////////
    that.getValue = function () {
        var $value = that.get$root().find(">value");
        if (!$value.length) return null;
        return $value.text();
    };

    that.setValue = function(value) {
        var $value = that.get$root().find(">value");

        // Removal
        if (!value) {
            if($value.length) deleteValue($value);
            return that;
        }

        var $newValue = microparser.parse(value, grammar.value);

        // Creation
        if(!$value.length) {
            createValue($newValue);
            return that;
        }

        // Update
        $value.replaceWith($newValue);
        return that;
    };

    function createValue($newValue) {
        that.get$root().find(">variable").after([" = ", $newValue]);
    }

    function deleteValue($value) {
        $value.removePreviousText();
        $value.remove();
    }

    ////////////////////////////////////// Initialization //////////////////////////////////////
    if (code) that.setCode(code);
}

module.exports = PhpConstant;

