var PhpConstant = require(__dirname + "/../PhpConstant.js");
var PhpDoc = require(__dirname + "/../PhpDoc.js");
var assert = require('assert');

describe('PhpConstant', function() {
    describe('#getName()', function() {
        it('should return default name', function() {
            var phpConstant = new PhpConstant();
            assert.equal(phpConstant.getName(), "TODO");
        });
        it('should return name from init code', function() {
            var phpConstant = new PhpConstant(`const FOOBAR = 0;`);
            assert.equal(phpConstant.getName(), "FOOBAR");
        });
    });

    describe('#setName()', function() {
        it('should modify default name', function() {
            var phpConstant = new PhpConstant();
            phpConstant.setName("foo");
            assert.equal(phpConstant.getName(), "foo");
        });
        it('should modify name from init code', function() {
            var phpConstant = new PhpConstant(`const FOOBAR = 0;`);
            phpConstant.setName("BAR");
            assert.equal(phpConstant.getName(), "BAR");
            assert.equal(phpConstant.getCode(), `const BAR = 0;`);
        });
    });

    describe('#getDoc()', function() {
        it('should return no doc by default', function() {
            var phpConstant = new PhpConstant();
            assert.equal(phpConstant.getDoc(), null);
        });
        it('should return doc from init code', function() {
            var phpConstant = new PhpConstant(`/** 
 * Foo.
 */
const FOO = 1;`);
            var doc = phpConstant.getDoc();
            assert.equal(doc.getDescription(), "Foo.");
        });
    });

    describe('#setDoc()', function() {
        it('should add doc', function() {
            var phpConstant = new PhpConstant().setDoc(new PhpDoc().setDescription("Foo !"));
            assert.equal(phpConstant.getCode(), `/**
 * Foo !
 */
const TODO = null;`);
        });
        it('should modify doc from init code', function() {
            var phpConstant = new PhpConstant(`/**
 * Foo !
 */
const TODO = null;`);
            phpConstant.setDoc(new PhpDoc().setDescription("Bar !"));
            assert.equal(phpConstant.getCode(), `/**
 * Bar !
 */
const TODO = null;`);
        });
        it('should delete doc', function() {
            var phpConstant = new PhpConstant(`/**
 * Foo !
 */
const TODO = null;`);
            phpConstant.setDoc(null);
            assert.equal(phpConstant.getCode(), `const TODO = null;`);
        });
    });

    describe('#getValue()', function() {
        it('should return the default value', function() {
            var phpConstant = new PhpConstant();
            assert.equal(phpConstant.getValue(), "null");
        });
        it('should return value from init code', function() {
            var phpConstant = new PhpConstant(`const FOO = 3;`);
            assert.equal(phpConstant.getValue(), "3");
        });
    });

    describe('#setValue()', function() {
        it('should modify default value', function() {
            var phpConstant = new PhpConstant().setValue("'Foo'");
            assert.equal(phpConstant.getValue(), "'Foo'");
            assert.equal(phpConstant.getCode(), `const TODO = 'Foo';`);
        });
        it('should modify value from init code', function() {
            var phpConstant = new PhpConstant(`const FOO = false;`).setValue("true");
            assert.equal(phpConstant.getValue(), "true");
            assert.equal(phpConstant.getCode(), `const FOO = true;`);
        });
    });

});