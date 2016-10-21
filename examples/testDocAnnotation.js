var PhpDocAnnotation = require(__dirname + "/../PhpDocAnnotation.js");

var code = `@param $img is an image id from the gallery or a http url.
 * This annotation is multiline.`;

var annotation = new PhpDocAnnotation(code);
console.log(annotation.get$root().xml());

console.log("==========");
annotation.setName("foo");
console.log(annotation.getCode());

console.log("==========");
annotation.setName("param");
annotation.setValue("$foo string Une chaîne de caractères.");
console.log(annotation.getCode());

console.log("==========");
annotation = new PhpDocAnnotation();
console.log(annotation.getCode());
console.log("==========");
annotation.setName("author").setValue("Simon Robert <srob@srob.fr>");
console.log(annotation.getCode());
