var grammar = require(__dirname + "/grammar.js");
var templates = require(__dirname + "/templates.js");
var microparser = require('microparser');
var _ = require('lodash');
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

    that.setCode = function (code) {
        $root = microparser.parse(code, grammar.file);
    };

    that.get$root = function () {
        if (!$root) that.setCode(templates.file);
        return $root;
    };

    /**
     * Returns the code.
     * @return {string}
     */
    that.getCode = function () {
        return that.get$root().text();
    };

    ////////////////////////////////////// PHPDoc  //////////////////////////////////////
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
        that.get$root().find(">abstract,>class").first().before([$newDoc, "\n"]); // TODO
    }

    ////////////////////////////////////// Initialization //////////////////////////////////////
    if (code) that.setCode(code);
}

module.exports = PhpFile;
