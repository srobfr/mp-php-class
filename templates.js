/**
 * PHP Class default templates.
 */

var doc = `/**
 * TODO
 */`;

var docAnnotation = `@todo`;

var class_ = `class TODO
{

}`;

var file = `<?php

${class_}
`;

// Published elements
module.exports = {
    doc: doc,
    docAnnotation: docAnnotation,
    class: class_,
    file: file
};