var PhpDoc = require(__dirname + "/../PhpDoc.js");

var code = `/**
 * Description line.
 *
 * Long description line,
 * multiline.
 *
 * Can also span on blank lines.
 * @param $img is an image id from the gallery or a http url.
 * @param $width is the width to which the image can be resized. can be in pixels or
 * percentage of the device width.
 * if $width == 0, the image won't be resized
 *
 * @param($quality from 0 to 10, 10 is the best, -1 to take default value set in site config)
 * @return string - url
 */`;

// code = null;

var doc = new PhpDoc(code);
console.log(doc.get$root().xml());
console.log("==========");

var annotations = doc.getAnnotations();
console.log(annotations[0].getValue());

