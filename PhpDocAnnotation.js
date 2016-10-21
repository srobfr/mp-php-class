var grammar = require(__dirname + "/grammar.js");
var templates = require(__dirname + "/templates.js");
var microparser = require('microparser');

function PhpDocAnnotation(code, $root) {
    var that = this;

    that.setCode = function (code) {
        $root = microparser.parse(code, grammar.docAnnotation, ($root ? $root.$ : undefined));
    };

    that.get$root = function () {
        if (!$root) that.setCode(templates.docAnnotation);
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
        return that.get$root().find(">annotation>name").text();
    };

    that.setName = function (name) {
        that.get$root().find(">annotation>name").text(name);
        return that;
    };

    ////////////////////////////////////// Value //////////////////////////////////////
    that.getValue = function () {
        return that.get$root().find(">annotation>value").text();
    };

    that.setValue = function (value) {
        var $value = that.get$root().find(">annotation>value");

        // Suppression
        if (!value) {
            if($value.length) deleteValue($value);
            return that;
        }

        var prefixedValue = value.replace(/\n/g, "\n * ");
        var $newValue = microparser.parse(prefixedValue, grammar.docAnnotationValue, $root.$).find(">value");

        // Création
        if(!$value.length) {
            createValue($newValue);
            return that;
        }

        // Mise à jour
        $value.replaceWith($newValue);
        return that;
    };

    function createValue($newValue) {
        that.get$root().find(">annotation>name").after([" ", $newValue]);
    }

    function deleteValue($value) {
        $value.prevUntil("name").remove();
        $value.removePreviousText();
        $value.remove();
    }

    ////////////////////////////////////// Initialization //////////////////////////////////////
    if (code) that.setCode(code);
}

module.exports = PhpDocAnnotation;

