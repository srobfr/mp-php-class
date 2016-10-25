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

/**
 * PHP class property.
 * @type {string}
 */
var property = `private $todo;`;

/**
 * PHP function argument.
 * @type {string}
 */
var funcArg= `$todo`;

/**
 * PHP class constant.
 * @type {string}
 */
var constant = `const TODO = null;`;

/**
 * PHP method.
 * @type {string}
 */
var method = `public function todo()
{
    // TODO
}`;

/**
 * PHP Class.
 * @type {string}
 * @private
 */
var class_ = `class Todo
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
    funcArg: funcArg,
    constant: constant,
    method: method,
    file: file
};