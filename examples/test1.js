var PhpClass = require(__dirname + "/../PhpClass.js");

var code = `<?php

class TODO
{
    public function fooBar($bar) {
    }
}
`;

var myClass = new PhpClass(code);

console.log(myClass.getCode());

console.log(myClass.$.xml());
