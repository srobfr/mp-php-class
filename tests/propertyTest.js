var PhpProperty = require(__dirname + "/../PhpProperty.js");
var PhpDoc = require(__dirname + "/../PhpDoc.js");
var assert = require('assert');

describe('PhpProperty', function() {
    describe('#getName()', function() {
        it('should return default name', function() {
            var phpProperty = new PhpProperty();
            assert.equal(phpProperty.getName(), "todo");
        });
        it('should return name from init code', function() {
            var phpProperty = new PhpProperty(`private $foo;`);
            assert.equal(phpProperty.getName(), "foo");
        });
    });

    describe('#setName()', function() {
        it('should modify default name', function() {
            var phpProperty = new PhpProperty();
            phpProperty.setName("foo");
            assert.equal(phpProperty.getName(), "foo");
        });
        it('should modify name from init code', function() {
            var phpProperty = new PhpProperty(`private $foo;`);
            phpProperty.setName("bar");
            assert.equal(phpProperty.getName(), "bar");
        });
        it('should modify the property code', function() {
            var phpProperty = new PhpProperty(`private $foo;`);
            phpProperty.setName("bar");
            assert.equal(phpProperty.getCode(), `private $bar;`);
        });
    });

    describe('#getVisibility()', function() {
        it('should return default visibility', function() {
            var phpProperty = new PhpProperty();
            assert.equal(phpProperty.getVisibility(), "private");
        });
        it('should return name from init code', function() {
            var phpProperty = new PhpProperty(`protected $foo;`);
            assert.equal(phpProperty.getVisibility(), "protected");
        });
    });

    describe('#setVisibility()', function() {
        it('should modify default visibility', function() {
            var phpProperty = new PhpProperty().setVisibility("public");
            assert.equal(phpProperty.getVisibility(), "public");
            assert.equal(phpProperty.getCode(), `public $todo;`);
        });
        it('should modify visibility from init code', function() {
            var phpProperty = new PhpProperty(`public $foo;`).setVisibility("private");
            assert.equal(phpProperty.getVisibility(), "private");
            assert.equal(phpProperty.getCode(), `private $foo;`);
        });
    });

    describe('#isStatic()', function() {
        it('should return default static', function() {
            var phpProperty = new PhpProperty();
            assert.equal(phpProperty.isStatic(), false);
        });
        it('should return name from init code', function() {
            var phpProperty = new PhpProperty(`static protected $foo;`);
            assert.equal(phpProperty.isStatic(), true);
        });
    });

    describe('#setStatic()', function() {
        it('should modify default static', function() {
            var phpProperty = new PhpProperty().setStatic(true);

            assert.equal(phpProperty.isStatic(), true);
            assert.equal(phpProperty.getCode(), `private static $todo;`);
        });
        it('should modify static from init code', function() {
            var phpProperty = new PhpProperty(`static public $foo;`).setStatic(false);
            assert.equal(phpProperty.isStatic(), false);
            assert.equal(phpProperty.getCode(), `public $foo;`);
        });
    });

    describe('#getDoc()', function() {
        it('should return no doc by default', function() {
            var phpProperty = new PhpProperty();
            assert.equal(phpProperty.getDoc(), null);
        });
        it('should return doc from init code', function() {
            var phpProperty = new PhpProperty(`/** Foo. */
            protected $foo;`);
            var doc = phpProperty.getDoc();
            assert.equal(doc.getDescription(), "Foo. ");
        });
    });

    describe('#setDoc()', function() {
        it('should add doc', function() {
            var phpProperty = new PhpProperty().setDoc(new PhpDoc().setDescription("Foo !"));
            assert.equal(phpProperty.getCode(), `/**
 * Foo !
 */
private $todo;`);
        });
        it('should modify doc from init code', function() {
            var phpProperty = new PhpProperty(`/**
 * Foo !
 */
private $todo;`);
            phpProperty.setDoc(new PhpDoc().setDescription("Bar !"));
            assert.equal(phpProperty.getCode(), `/**
 * Bar !
 */
private $todo;`);
        });
        it('should delete doc', function() {
            var phpProperty = new PhpProperty(`/**
 * Foo !
 */
private $todo;`);
            phpProperty.setDoc(null);
            assert.equal(phpProperty.getCode(), `private $todo;`);
        });
    });

    describe('#getValue()', function() {
        it('should return no value by default', function() {
            var phpProperty = new PhpProperty();
            assert.equal(phpProperty.getValue(), null);
        });
        it('should return value from init code', function() {
            var phpProperty = new PhpProperty(`protected $foo = 3;`);
            assert.equal(phpProperty.getValue(), "3");
        });
    });

    describe('#setValue()', function() {
        it('should modify default value', function() {
            var phpProperty = new PhpProperty().setValue("'Foo'");
            assert.equal(phpProperty.getValue(), "'Foo'");
            assert.equal(phpProperty.getCode(), `private $todo = 'Foo';`);
        });
        it('should modify value from init code', function() {
            var phpProperty = new PhpProperty(`public $foo = false;`).setValue("true");
            assert.equal(phpProperty.getValue(), "true");
            assert.equal(phpProperty.getCode(), `public $foo = true;`);
        });
        it('should delete value', function() {
            var phpProperty = new PhpProperty(`public $foo = 1;`).setValue(null);
            assert.equal(phpProperty.getValue(), null);
            assert.equal(phpProperty.getCode(), `public $foo;`);
        });
    });

});