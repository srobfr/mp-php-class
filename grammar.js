/**
 * PHP Class grammar definition.
 */

var microparser = require('microparser');
var g = microparser.grammarHelper;

var w = /^[ \t\r\n]+/;
var lw = /^[ \t]+/;
var ow = g.optional(w);
var olw = g.optional(lw);
var eof = /^$/;
var phpBlockStart = "<?php";
var phpBlockEnd = [ow, g.or("?>", eof)];

var commentBlock = /^\/\*[.\n\r]*\*\//; // TODO Handle comments blocks
var commentLine = /^\/\/.*(?:\n|\r|\r\n)/; // TODO Handle comments lines

var quotedString = /^'(\\'|[^']+)*'/;
var doubleQuotedString = /^"(\\"|[^"]+)*"/;
var string = g.or(quotedString, doubleQuotedString);
var numeric = /^(-?)(\d*\.\d+|\d+[eE]\d+|0x[\da-f]+|\d+)/i;
var ident = /^[a-z_][\w_]*/i;
var fullIdent = g.multiple(ident, "\\");
var valueKeyword = g.or("null", "NULL", "true", "TRUE", "false", "FALSE");
var visibility = g.tag("visibility", g.or("private", "public", "protected"));
var abstract = g.tag("abstract", "abstract");
var static_ = g.tag("static", "static");
var final = g.tag("final", "final");
var marker = g.or(visibility, abstract, static_, final);

var _parBlock = [];
var parBlockItem = g.or(_parBlock, /^[^\(\)]+/);
var parBlock = ["(", g.optional(g.multiple(parBlockItem)), ")"];
_parBlock.push(parBlock);

var variable = g.tag("variable", ["$", g.tag("name", ident)]);

var staticArray = ["array", ow, parBlock];

var staticExpr = g.or(string, numeric, valueKeyword, staticArray);

// Parsing de la PHPDoc
var docStart = g.tag("start", /^\/\*\*[ \t]*/);
var docLinePrefix = [/^(?:\n|\r|\r\n)/, g.tag("lineprefix", /^[ \t]*\*(?!\/) ?/)];
var docEnd = g.tag("end", /^(?:\n|\r|\r\n)?[ \t]*\*\//);
var docLine = g.until(g.or(/^[^\*\n\r]+/, "*"), null, docEnd);
var docBlankLines = g.multiple(docLinePrefix);
var docOptionalBlankLines = g.optional(docBlankLines);

var docLineNotAnnotation = [g.not(["@", ident]), docLine];

var docAnnotationValue = g.tag("value", g.multiple(
    docLineNotAnnotation,
    docBlankLines
));

var docAnnotation = g.tag("annotation", [
    "@", g.tag("name", ident),
    g.optional([
        olw,
        docAnnotationValue
    ])
]);

var docDesc = g.tag("desc", docLine);
var docLongDesc = g.tag("longdesc", g.multiple(docLineNotAnnotation, docBlankLines));

var doc = g.tag("doc", [
    docStart, docOptionalBlankLines,
    docDesc, docOptionalBlankLines,
    g.optional([
        docLongDesc, docOptionalBlankLines
    ]),
    g.optional(g.multiple(
        docAnnotation, docOptionalBlankLines
    )),
    docEnd
]);

var value = g.tag("value", staticExpr);
var defaultValue = [ow, "=", ow, value];

var type = g.tag("type", fullIdent);

var funcArg = g.tag("arg", [
    g.optional([type, w]),
    variable,
    g.optional(defaultValue)
]);
var funcArgs = g.tag("args", g.optional([g.multiple(funcArg, [ow, ",", ow]), ow]));

var _curBlock = [];
var curBlockItem = g.or(_curBlock, /^[^{}]+/);
var curBlock = ["{", g.optional(g.multiple(curBlockItem)), "}"];
_curBlock.push(curBlock);

var funcBodyEnd = [ow, "}"];
var funcImplementationPart = g.or(curBlock, /^[^{} \t\r\n]+/, w);
var funcImplementation = g.tag("implementation", g.until(funcImplementationPart, undefined, funcBodyEnd));

var funcBody = g.tag("body", [
    ow,
    g.or(
        ";",
        ["{", ow, funcImplementation, funcBodyEnd]
    )
]);
var func = [g.tag("function", "function"), w, g.tag("name", ident), ow, "(", ow, funcArgs, ow, ")", funcBody];

var constant = g.tag("constant", [g.optional([doc, ow]), g.tag("const", "const"), w, g.tag("name", ident), defaultValue, ow, ";"]);
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
    constant: constant,
    function: func,
    method: method,
    funcArg: funcArg,
    funcImplementation: funcImplementation,
    type: type,
    doc: doc,
    docLongDesc: docLongDesc,
    docAnnotation: docAnnotation,
    docAnnotationValue: docAnnotationValue,
    visibility: visibility,
    static: static_,
    abstract: abstract,
    value: value,
    class: klass,
    file: file
};