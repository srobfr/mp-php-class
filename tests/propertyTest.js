var PhpProperty = require(__dirname + "/../PhpProperty.js");
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

});