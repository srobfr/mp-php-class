var PhpClass = require(__dirname + "/../PhpClass.js");
var PhpClass = require(__dirname + "/../PhpClass.js");
var PhpFunctionArgument = require(__dirname + "/../PhpFunctionArgument.js");
var PhpDoc = require(__dirname + "/../PhpDoc.js");
var assert = require('assert');

describe('PhpClass', function() {
    describe('#getName()', function() {
        it('should return default name', function() {
            var phpClass = new PhpClass();
            assert.equal(phpClass.getName(), "Todo");
        });
        it('should return name from init code', function() {
            var phpClass = new PhpClass(`class Foo {}`);
            assert.equal(phpClass.getName(), "Foo");
        });
    });

    describe('#setName()', function() {
        it('should modify default name', function() {
            var phpClass = new PhpClass();
            phpClass.setName("Foo");
            assert.equal(phpClass.getName(), "Foo");
        });
        it('should modify name from init code', function() {
            var phpClass = new PhpClass(`interface Foo {}`);
            phpClass.setName("Bar");
            assert.equal(phpClass.getName(), "Bar");
            assert.equal(phpClass.getCode(), `interface Bar {}`);
        });
    });

    describe('#isAbstract()', function() {
        it('should return default abstract', function() {
            var phpClass = new PhpClass();
            assert.equal(phpClass.isAbstract(), false);
        });
        it('should return name from init code', function() {
            var phpClass = new PhpClass(`abstract class Foo {}`);
            assert.equal(phpClass.isAbstract(), true);
        });
    });

    describe('#setAbstract()', function() {
        it('should modify default abstract', function() {
            var phpClass = new PhpClass().setAbstract(true);
            assert.equal(phpClass.isAbstract(), true);
            assert.equal(phpClass.getCode(), `abstract class Todo
{

}`);
        });
        it('should modify abstract from init code', function() {
            var phpClass = new PhpClass(`abstract class Foo {}`).setAbstract(false);
            assert.equal(phpClass.isAbstract(), false);
            assert.equal(phpClass.getCode(), `class Foo {}`);
        });
    });

});