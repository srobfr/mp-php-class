/**
 * PHP Class default templates.
 */

/**
 * Full PhpDoc.
 * @type {string}
 */
var doc = `/**
 * TODO
 */`;

/**
 * One PHPDoc annotation.
 * @type {string}
 */
var docAnnotation = `@todo`;

var property = `private $todo;`;

/**
 * PHP Class.
 * @type {string}
 * @private
 */
var class_ = `class TODO
{

}`;

/**
 * Full PHP file.
 * @type {string}
 * @private
 */
var file = `<?php

${class_}
`;

/**
 * Published elements
 * @type {{}}
 */
module.exports = {
    doc: doc,
    docAnnotation: docAnnotation,
    class: class_,
    property: property,
    file: file
};