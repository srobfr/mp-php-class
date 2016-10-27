var grammar = require(__dirname + "/grammar.js");
var templates = require(__dirname + "/templates.js");
var microparser = require('microparser');

/**
 * Represents a PHP function argument.
 * @param code {string} - The initial code.
 * @param $root - The initial DOM element.
 * @constructor
 */
function PhpFunctionArgument(code, $root) {
    var that = this;

    /**
     * Sets this node code.
     * @param code
     */
    that.setCode = function (code) {
        $root = microparser.parse(code, grammar.funcArg);
    };

    that.get$root = function () {
        if (!$root) that.setCode(templates.funcArg);
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

    ////////////////////////////////////// Type //////////////////////////////////////
    that.getType = function () {
        var $type = that.get$root().find(">type");
        if (!$type.length) return null;
        return $type.text();
    };

    that.setType = function(type) {
        var $type = that.get$root().find(">type");

        // Removal
        if (!type) {
            if($type.length) deleteType($type);
            return that;
        }

        var $newType = microparser.parse(type, grammar.type);

        // Creation
        if(!$type.length) {
            createType($newType);
            return that;
        }

        // Update
        $type.replaceWith($newType);
        return that;
    };

    function createType($newType) {
        that.get$root().find(">variable").before([$newType, " "]);
    }

    function deleteType($type) {
        $type.removeNextText();
        $type.remove();
    }

    ////////////////////////////////////// Initialization //////////////////////////////////////
    if (code) that.setCode(code);
}

module.exports = PhpFunctionArgument;

