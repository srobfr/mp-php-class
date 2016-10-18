/**
 * PHP Class grammar definition.
 */

var microparser = require('microparser');
var g = microparser.xmlGrammar;

var w = /^[ \t\r\n]+/;
var lw = /^[ \t]+/;
var ow = g.optional(w);
var eof = /^$/;
var phpBlockStart = "<?php";
var phpBlockEnd = [ow, g.or("?>", eof)];

var commentBlock = /^\/\*[.\n\r]*\*\//; // TODO Gérer les commentaires
var commentLine = /^\/\/.*(?:\n|\r|\r\n)/; // TODO Gérer les commentaires

var quotedString = /^'(\\'|[^']+)*'/;
var doubleQuotedString = /^"(\\"|[^"]+)*"/;
var string = g.or(quotedString, doubleQuotedString);
var numeric = /^(-?)(\d*\.\d+|\d+[eE]\d+|0x[\da-f]+|\d+)/i;
var ident = /^[a-z_][\w_]*/i;
var fullIdent = g.multiple(ident, "\\");
var valueKeyword = g.or("null", "NULL", "true", "TRUE", "false", "FALSE");
var visibility = g.tag("visibility", g.or("private", "public", "protected"));
var abstract = g.tag("abstract", "abstract");
var static = g.tag("static", "static");
var final = g.tag("final", "final");
var marker = g.or(visibility, abstract, static, final);

var _parBlock = [];
var parBlockItem = g.or(_parBlock, /^[^\(\)]+/);
var parBlock = ["(", g.optional(g.multiple(parBlockItem)), ")"];
_parBlock.push(parBlock);

var variable = ["$", g.tag("name", ident)];

var staticArray = ["array", ow, parBlock];

var staticExpr = g.or(string, numeric, valueKeyword, staticArray);

// Parsing de la PHPDoc
var docStart = g.tag("docstart", /^\/\*\*[ \t]*/);
var docLineStart = /^(?:\n|\r|\r\n)[ \t]*\* ?/;
var docEnd = g.tag("docend", /^(?:\n|\r|\r\n)[ \t]*\*\//);
var docLine = [docLineStart, g.tag("content", /^.+/)];
var docBlankLine = docLineStart;
var docAnnotationLine = [
    docLineStart, "@", g.tag("name", ident),
    g.optional([lw, g.tag("desc", /^.+/)])
];

var docAnnotation = g.tag("annotation", [
    docAnnotationLine,
    g.optional(g.until(docLine, null, g.or(docAnnotationLine, docEnd)))
]);
var docOptionalBlankLines = g.optional(g.until(docBlankLine, null, g.or(docAnnotationLine, docLine, docEnd)));
var docDesc = g.tag("desc", [g.not(docAnnotationLine), docLine]);
var docLongDesc = g.tag("longdesc", g.until(docLine, docOptionalBlankLines, g.or(docAnnotationLine, docEnd)));
var doc = g.tag("doc", [
    docStart,
    docOptionalBlankLines,
    g.optional([
        docDesc,
        docOptionalBlankLines
    ]),
    g.optional([
        docLongDesc,
        docOptionalBlankLines
    ]),
    g.optional(g.multiple(docAnnotation, docOptionalBlankLines)),
    docEnd
]);

var defaultValue = [ow, "=", ow, g.tag("value", staticExpr)];

var funcArg = g.tag("arg", [
    g.optional([g.tag("type", fullIdent), w]),
    variable,
    g.optional(defaultValue)
]);
var funcArgs = g.tag("args", ["(", ow, g.optional([g.multiple(funcArg, [ow, ",", ow]), ow]), ")"]);

var _curBlock = [];
var curBlockItem = g.or(_curBlock, /^[^{}]+/);
var curBlock = ["{", g.optional(g.multiple(curBlockItem)), "}"];
_curBlock.push(curBlock);

var funcBody = g.tag("body", g.or(
    ";",
    ["{", g.tag("content", g.optional(g.multiple(curBlockItem))), "}"]
));
var func = ["function", w, g.tag("name", ident), ow, funcArgs, ow, funcBody];

var constant = g.tag("constant", [g.optional([doc, ow]), "const", w, g.tag("name", ident), defaultValue, ow, ";"]);
var property = g.tag("property", [g.optional([doc, ow]), g.optional([g.multiple(marker, w), w]), variable, g.optional(defaultValue), ow, ";"]);

var method = g.tag("method", [g.optional([doc, ow]), g.optional([g.multiple(marker, w), w]), func]);

var classBody = ["{", g.tag("content", g.optional(g.multiple(g.or(constant, property, method, w)))), "}"];

var klass = g.tag("class", [
    g.optional([doc, ow]),
    g.optional([g.multiple(marker, w), w]),
    g.tag("kind", g.or("class", "interface")), w, g.tag("name", ident),
    g.optional(g.multiple(g.or(
        [w, g.tag("extends", ["extends", w, g.tag("type", fullIdent)])],
        [w, g.tag("implements", ["implements", w, g.multiple(g.tag("type", fullIdent), [ow, ",", ow])])]
    ))),
    ow, g.tag("body", classBody)
]);

var require = g.tag("require", [/^(?:require|include)(?:_once)?/, ow, g.tag("value", /^[^;]+/), ";"]);

var file = [
    g.tag("start", phpBlockStart), ow,
    g.optional([doc, ow]),
    g.optional([g.multiple(require, w), ow]),
    klass, ow,
    phpBlockEnd,
    g.optional([ow, eof])
];

// Published elements
module.exports = {
    variable: variable,
    property: property,
    function: func,
    method: method,
    doc: doc,
    class: klass,
    file: file
};