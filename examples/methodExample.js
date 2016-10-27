var PhpMethod = require(__dirname + "/../PhpMethod.js");
var PhpDoc = require(__dirname + "/../PhpDoc.js");
var PhpDocAnnotation = require(__dirname + "/../PhpDocAnnotation.js");
var PhpFunctionArgument = require(__dirname + "/../PhpFunctionArgument.js");

var method = new PhpMethod()
    .setName("__construct")
    .setVisibility("protected")
    .setStatic(true)
    .setDoc(new PhpDoc().setDescription("Hello world."))
    .setImplementation(`// Refactoring foobar.

plop();
$this->foo = $foo;`);

console.log(method.getCode());

