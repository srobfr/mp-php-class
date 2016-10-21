var grammar = require(__dirname + "/grammar.js");
var templates = require(__dirname + "/templates.js");
var PhpDocAnnotation = require(__dirname + "/PhpDocAnnotation.js");
var microparser = require('microparser');

function PhpDoc(code, $root) {
    var that = this;

    that.setCode = function (code) {
        $root = microparser.parse(code, grammar.doc, ($root ? $root.$ : undefined));
    };

    that.get$root = function () {
        if (!$root) that.setCode(templates.doc);
        return $root;
    };

    /**
     * Returns the code.
     * @return {string}
     */
    that.getCode = function () {
        return that.get$root().text();
    };

    ////////////////////////////////////// Description //////////////////////////////////////
    that.getDescription = function () {
        return that.get$root().find(">doc>desc").text();
    };

    that.setDescription = function (description) {
        that.get$root().find(">doc>desc").text(description);
        return that;
    };

    ////////////////////////////////////// Long description //////////////////////////////////////
    that.getLongDescription = function () {
        var $longDescClone = that.get$root().find(">doc>longdesc").clone();
        $longDescClone.find(">lineprefix").remove();
        return $longDescClone.text();
    };

    that.setLongDescription = function (longDescription) {
        var $longDesc = that.get$root().find(">doc>longdesc");

        // Suppression
        if (!longDescription) {
            if($longDesc.length) deleteLongDescription($longDesc);
            return that;
        }

        var prefixedLongDesc = longDescription.replace(/\n/g, "\n * ");
        var $newLongDesc = microparser.parse(prefixedLongDesc, grammar.docLongDesc, $root.$);

        // Création
        if(!$longDesc.length) {
            createLongDescription($newLongDesc);
            return that;
        }

        // Mise à jour
        $longDesc.replaceWith($newLongDesc);
        return that;
    };

    function createLongDescription($newLongDesc) {
        var $root = that.get$root();
        var $linePrefix = $root.create('<lineprefix/>').text(" * ");
        $root.find(">doc>desc").after([
            '\n', $linePrefix,
            '\n', $linePrefix.clone(), $newLongDesc
        ]);
    }

    function deleteLongDescription($longDesc) {
        $longDesc.prevUntil("desc").remove();
        $longDesc.removePreviousText();
        $longDesc.remove();
    }

    ////////////////////////////////////// Annotations //////////////////////////////////////
    that.getAnnotations = function () {
        var $annotations = that.get$root().find(">doc>annotation");
        return $annotations
            .toArray()
            .map(function(node) {
                return new PhpDocAnnotation(null, $annotations.$.call(undefined, node));
            });
    };

    ////////////////////////////////////// Initialization //////////////////////////////////////
    if (code) that.setCode(code);
}

module.exports = PhpDoc;

