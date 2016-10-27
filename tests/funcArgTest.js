var PhpFunctionArgument = require(__dirname + "/../PhpFunctionArgument.js");
var assert = require('assert');

describe('PhpFunctionArgument', function() {
    describe('#getName()', function() {
        it('should return default name', function() {
            var phpFunctionArgument = new PhpFunctionArgument();
            assert.equal(phpFunctionArgument.getName(), "todo");
        });
        it('should return name from init code', function() {
            var phpFunctionArgument = new PhpFunctionArgument(`$foo`);
            assert.equal(phpFunctionArgument.getName(), "foo");
        });
    });

    describe('#setName()', function() {
        it('should modify default name', function() {
            var phpFunctionArgument = new PhpFunctionArgument();
            phpFunctionArgument.setName("foo");
            assert.equal(phpFunctionArgument.getName(), "foo");
        });
        it('should modify name from init code', function() {
            var phpFunctionArgument = new PhpFunctionArgument(`$foo`);
            phpFunctionArgument.setName("bar");
            assert.equal(phpFunctionArgument.getName(), "bar");
            assert.equal(phpFunctionArgument.getCode(), `$bar`);
        });
    });

    describe('#getValue()', function() {
        it('should return no value by default', function() {
            var phpFunctionArgument = new PhpFunctionArgument();
            assert.equal(phpFunctionArgument.getValue(), null);
        });
        it('should return value from init code', function() {
            var phpFunctionArgument = new PhpFunctionArgument(`$foo = 3`);
            assert.equal(phpFunctionArgument.getValue(), "3");
        });
    });

    describe('#setValue()', function() {
        it('should modify default value', function() {
            var phpFunctionArgument = new PhpFunctionArgument().setValue("'Foo'");
            assert.equal(phpFunctionArgument.getValue(), "'Foo'");
            assert.equal(phpFunctionArgument.getCode(), `$todo = 'Foo'`);
        });
        it('should modify value from init code', function() {
            var phpFunctionArgument = new PhpFunctionArgument(`$foo = false`).setValue("true");
            assert.equal(phpFunctionArgument.getValue(), "true");
            assert.equal(phpFunctionArgument.getCode(), `$foo = true`);
        });
        it('should delete value', function() {
            var phpFunctionArgument = new PhpFunctionArgument(`$foo = 1`).setValue(null);
            assert.equal(phpFunctionArgument.getValue(), null);
            assert.equal(phpFunctionArgument.getCode(), `$foo`);
        });
    });

    describe('#getType()', function() {
        it('should return no type by default', function() {
            var phpFunctionArgument = new PhpFunctionArgument();
            assert.equal(phpFunctionArgument.getType(), null);
        });
        it('should return type from init code', function() {
            var phpFunctionArgument = new PhpFunctionArgument(`Type $foo`);
            assert.equal(phpFunctionArgument.getType(), "Type");
        });
    });

    describe('#setType()', function() {
        it('should modify default type', function() {
            var phpFunctionArgument = new PhpFunctionArgument().setType("Foo");
            assert.equal(phpFunctionArgument.getType(), "Foo");
            assert.equal(phpFunctionArgument.getCode(), `Foo $todo`);
        });
        it('should modify type from init code', function() {
            var phpFunctionArgument = new PhpFunctionArgument(`$foo`).setType("MyType");
            assert.equal(phpFunctionArgument.getType(), "MyType");
            assert.equal(phpFunctionArgument.getCode(), `MyType $foo`);
        });
        it('should delete type', function() {
            var phpFunctionArgument = new PhpFunctionArgument(`Foo $foo = 1`).setType(null);
            assert.equal(phpFunctionArgument.getType(), null);
            assert.equal(phpFunctionArgument.getCode(), `$foo = 1`);
        });
    });

});