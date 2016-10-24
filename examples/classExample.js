var PhpClass = require(__dirname + "/../PhpClass.js");

var code = `<?php

/**
 *Foo
 */
class TODO
{
    public function fooBar($bar) {
    }
}
`;

var myClass = new PhpClass(code);

console.log(myClass.getName());
myClass.setName("Foo");
console.log(myClass.get$root().xml());
console.log(myClass.getCode());