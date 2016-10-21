var grammar = require(__dirname + "/grammar.js");
var templates = require(__dirname + "/templates.js");
var _ = require("lodash");
var microparser = require('microparser');

function PhpClass(code) {
    var that = this;

    var parser = microparser.buildParser(grammar.file);

    /**
     * Cheerio element.
     * @type {Cheerio}
     */
    that.$ = null;

    /**
     * Sets the code.
     * @param {string} code
     */
    that.setCode = function (code) {
        that.$ = parser.parse(code);
    };

    /**
     * Returns the code.
     * @return {string}
     */
    that.getCode = function () {
        return that.get$root().text();
    };

    that.getName = function () {
        return that.$.find(">class>name").text();
    };

    that.setName = function (name) {
        that.$.find(">class>name").text(name);
        return that;
    };

    // Initialization.
    if (code === undefined) code = templates.file;
    that.setCode(code);
}

module.exports = PhpClass;

