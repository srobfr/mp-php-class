var PhpProperty = require(__dirname + "/../PhpProperty.js");
var PhpDoc = require(__dirname + "/../PhpDoc.js");
var PhpDocAnnotation = require(__dirname + "/../PhpDocAnnotation.js");

var property = new PhpProperty()
    .setName("_fooBarPlopTest")
    // .setValue("1337")
    .setVisibility("public")
    .setStatic(true)
    .setDoc(
        new PhpDoc()
            .setDescription("Hello world.")
            .addAnnotation(
                new PhpDocAnnotation()
                    .setName("var")
                    .setValue("string")
            )
    );

console.log(property.getCode());