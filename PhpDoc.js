var grammar = require(__dirname + "/grammar.js");
var templates = require(__dirname + "/templates.js");
var PhpDocAnnotation = require(__dirname + "/PhpDocAnnotation.js");
var microparser = require('microparser');
var _ = require('lodash');
var $ = microparser.$;

function PhpDoc(code, $root) {
    var that = this;

    that.setCode = function (code) {
        $root = microparser.parse(code, grammar.doc);
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
        return that.get$root().find(">desc").text();
    };

    that.setDescription = function (description) {
        that.get$root().find(">desc").text(description);
        return that;
    };

    ////////////////////////////////////// Long description //////////////////////////////////////
    that.getLongDescription = function () {
        var $longDescClone = that.get$root().find(">longdesc").clone();
        $longDescClone.find(">lineprefix").remove();
        return $longDescClone.text();
    };

    that.setLongDescription = function (longDescription) {
        var $longDesc = that.get$root().find(">longdesc");

        // Suppression
        if (!longDescription) {
            if ($longDesc.length) deleteLongDescription($longDesc);
            return that;
        }

        var prefixedLongDesc = longDescription.replace(/\n/g, "\n * ");
        var $newLongDesc = microparser.parse(prefixedLongDesc, grammar.docLongDesc);

        // Création
        if (!$longDesc.length) {
            createLongDescription($newLongDesc);
            return that;
        }

        // Mise à jour
        $longDesc.replaceWith($newLongDesc);
        return that;
    };

    function createLongDescription($newLongDesc) {
        that.get$root().find(">desc").after([
            '\n', $('<lineprefix/>').text(" *"),
            '\n', $('<lineprefix/>').text(" * "), $newLongDesc
        ]);
    }

    function deleteLongDescription($longDesc) {
        $longDesc.prevUntil("desc").remove();
        $longDesc.removePreviousText();
        $longDesc.remove();
    }

    ////////////////////////////////////// Annotations //////////////////////////////////////
    that.getAnnotations = function () {
        var $annotations = that.get$root().find(">annotation");
        return $annotations
            .toArray()
            .map(function (node) {
                return new PhpDocAnnotation(null, $(node));
            });
    };

    that.findAnnotationsByValueRegex = function (regex) {
        var $annotations = that.get$root().find(">annotation");
        var result = [];
        $annotations.each(function () {
            var $annotation = $(this);
            if (!$(this).find(">value").text().match(regex)) return;
            result.push(new PhpDocAnnotation(null, $annotation));
        });

        return result;
    };

    that.addAnnotation = function (annotation, previousAnnotation) {
        var $root = that.get$root();
        var $annotation = annotation.get$root();

        if ($.contains($root, $annotation) && previousAnnotation === undefined) return; // Already added.
        var $annotations = $root.find(">annotation");

        // We look for the previous node.
        var $previousNode = null;
        if (previousAnnotation === null || $annotations.length === 0) $previousNode = $root.find(">desc,longdesc").last(); // First annotation
        else if (previousAnnotation !== undefined) $previousNode = previousAnnotation.get$root(); // After the given annotation
        else {
            // We have to find the previous annotation.
            var annotationsNodes = $annotations.toArray();
            var newNode = $annotation[0];
            annotationsNodes.push(newNode);

            var sortedAnnotationsNodes = annotationsNodes.sort(function(a, b) {
                var r = $(a).find(">name").text().localeCompare($(b).find(">name").text());
                r = r || $(a).find(">value").text().localeCompare($(b).find(">value").text());
                return r;
            });

            var index = _.findIndex(sortedAnnotationsNodes, function(node) {
                return node === newNode;
            });

            if (index > 0) $previousNode = $(sortedAnnotationsNodes[index - 1]);
            else $previousNode = $root.find(">desc,longdesc").last();
        }

        // We guess the required prefix string.
        var prefix = ["\n", $('<lineprefix/>').text(" * ")];
        if ($previousNode[0].tagName !== "annotation" || $previousNode.find(">name").text() !== annotation.get$root().find(">name").text()) {
            prefix.unshift("\n", $('<lineprefix/>').text(" *"));
        }

        // We guess the required suffix string.
        var suffix = [];
        var $nextNode = $previousNode.nextAll(":not(lineprefix)").eq(0);
        if($nextNode.length && $nextNode[0].tagName !== "end") {
            $nextNode.prevUntil(":not(lineprefix)").remove();
            $nextNode.removePreviousText();

            suffix.unshift("\n", $('<lineprefix/>').text(" * "));
            if ($nextNode[0].tagName !== "annotation" || $nextNode.find(">name").text() !== annotation.get$root().find(">name").text()) {
                suffix.unshift("\n", $('<lineprefix/>').text(" *"));
            }
        }

        $previousNode.after(_.flatten([prefix, annotation.get$root(), suffix]));
    };

    ////////////////////////////////////// Initialization //////////////////////////////////////
    if (code) that.setCode(code);
}

module.exports = PhpDoc;

