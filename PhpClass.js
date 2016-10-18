var grammar = require(__dirname + "/grammar.js");
var templates = require(__dirname + "/templates.js");
var cheerio = require("cheerio");
var _ = require("lodash");
var microparser = require('microparser');

function PhpClass(code) {
    var that = this;

    var Parser = microparser.parser.Parser;
    var fullGrammar = microparser.xmlGrammar.convert(grammar.file);
    var parser = new Parser(fullGrammar);

    /**
     * Cheerio DOM.
     * @type {Cheerio}
     */
    that.$ = null;

    /**
     * Sets the code.
     * @param {string} code
     */
    that.setCode = function(code) {
        var xml = _.flattenDeep(parser.parse(code)).join("");
        var $ = cheerio.load('<?xml version="1.0"?>' + "\n<root>" + xml + "</root>", {xmlMode: true});
        $.prototype.$ = $;
        that.$ = $.root().children("root");
    };

    /**
     * Returns the code.
     * @return {string}
     */
    that.getCode = function() {
        if (!that.$) return null;
        return that.$.root().children("root").text();
    };

    // Initialization.
    if(code === undefined) code = templates.file;
    that.setCode(code);
}

module.exports = PhpClass;

