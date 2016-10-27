var PhpMethod = require(__dirname + "/../PhpMethod.js");
var PhpFunctionArgument = require(__dirname + "/../PhpFunctionArgument.js");
var PhpDoc = require(__dirname + "/../PhpDoc.js");
var assert = require('assert');

describe('PhpMethod', function() {
    describe('#getName()', function() {
        it('should return default name', function() {
            var phpMethod = new PhpMethod();
            assert.equal(phpMethod.getName(), "todo");
        });
        it('should return name from init code', function() {
            var phpMethod = new PhpMethod(`function foo();`);
            assert.equal(phpMethod.getName(), "foo");
        });
    });

    describe('#setName()', function() {
        it('should modify default name', function() {
            var phpMethod = new PhpMethod();
            phpMethod.setName("foo");
            assert.equal(phpMethod.getName(), "foo");
        });
        it('should modify name from init code', function() {
            var phpMethod = new PhpMethod(`function foo();`);
            phpMethod.setName("bar");
            assert.equal(phpMethod.getName(), "bar");
            assert.equal(phpMethod.getCode(), `function bar();`);
        });
    });

    describe('#getVisibility()', function() {
        it('should return default visibility', function() {
            var phpMethod = new PhpMethod();
            assert.equal(phpMethod.getVisibility(), "public");
        });
        it('should return name from init code', function() {
            var phpMethod = new PhpMethod(`protected function foo();`);
            assert.equal(phpMethod.getVisibility(), "protected");
        });
    });

    describe('#setVisibility()', function() {
        it('should modify default visibility', function() {
            var phpMethod = new PhpMethod().setVisibility("public");
            assert.equal(phpMethod.getVisibility(), "public");
            assert.equal(phpMethod.getCode(), `public function todo()
{
    // TODO
}`);
        });
        it('should modify visibility from init code', function() {
            var phpMethod = new PhpMethod(`public function foo();`).setVisibility("private");
            assert.equal(phpMethod.getVisibility(), "private");
            assert.equal(phpMethod.getCode(), `private function foo();`);
        });
    });

    describe('#isStatic()', function() {
        it('should return default static', function() {
            var phpMethod = new PhpMethod();
            assert.equal(phpMethod.isStatic(), false);
        });
        it('should return name from init code', function() {
            var phpMethod = new PhpMethod(`static protected function foo();`);
            assert.equal(phpMethod.isStatic(), true);
        });
    });

    describe('#setStatic()', function() {
        it('should modify default static', function() {
            var phpMethod = new PhpMethod().setStatic(true);

            assert.equal(phpMethod.isStatic(), true);
            assert.equal(phpMethod.getCode(), `public static function todo()
{
    // TODO
}`);
        });
        it('should modify static from init code', function() {
            var phpMethod = new PhpMethod(`public static function todo();`).setStatic(false);
            assert.equal(phpMethod.isStatic(), false);
            assert.equal(phpMethod.getCode(), `public function todo();`);
        });
    });

    describe('#isAbstract()', function() {
        it('should return default abstract', function() {
            var phpMethod = new PhpMethod();
            assert.equal(phpMethod.isAbstract(), false);
        });
        it('should return name from init code', function() {
            var phpMethod = new PhpMethod(`abstract protected function foo();`);
            assert.equal(phpMethod.isAbstract(), true);
        });
    });

    describe('#setAbstract()', function() {
        it('should modify default abstract', function() {
            var phpMethod = new PhpMethod().setAbstract(true);

            assert.equal(phpMethod.isAbstract(), true);
            assert.equal(phpMethod.getCode(), `public abstract function todo()
{
    // TODO
}`);
        });
        it('should modify abstract from init code', function() {
            var phpMethod = new PhpMethod(`public abstract function todo();`).setAbstract(false);
            assert.equal(phpMethod.isAbstract(), false);
            assert.equal(phpMethod.getCode(), `public function todo();`);
        });
    });

    describe('#getDoc()', function() {
        it('should return no doc by default', function() {
            var phpMethod = new PhpMethod();
            assert.equal(phpMethod.getDoc(), null);
        });
        it('should return doc from init code', function() {
            var phpMethod = new PhpMethod(`/** Foo. */
protected function foo();`);
            var doc = phpMethod.getDoc();
            assert.equal(doc.getDescription(), "Foo. ");
        });
    });

    describe('#setDoc()', function() {
        it('should add doc', function() {
            var phpMethod = new PhpMethod().setDoc(new PhpDoc().setDescription("Foo !"));
            assert.equal(phpMethod.getCode(), `/**
 * Foo !
 */
public function todo()
{
    // TODO
}`);
        });
        it('should modify doc from init code', function() {
            var phpMethod = new PhpMethod(`/**
 * Foo !
 */
private function todo();`);
            phpMethod.setDoc(new PhpDoc().setDescription("Bar !"));
            assert.equal(phpMethod.getCode(), `/**
 * Bar !
 */
private function todo();`);
        });
        it('should delete doc', function() {
            var phpMethod = new PhpMethod(`/**
 * Foo !
 */
private function todo();`);
            phpMethod.setDoc(null);
            assert.equal(phpMethod.getCode(), `private function todo();`);
        });
    });

    describe('#getArguments()', function () {
        it('should return no argument by default', function () {
            var phpMethod = new PhpMethod();
            assert.deepEqual(phpMethod.getArguments(), []);
        });
        it('should return argument from init code', function () {
            var phpMethod = new PhpMethod(`function foo($bar, Plop $plop);`);
            var args = phpMethod.getArguments();
            assert.equal(args.length, 2);
            assert.equal(args[0].getName(), "bar");
        });
    });

    describe('#findArgumentByName()', function () {
        it('should return existing argument by name', function () {
            var phpMethod = new PhpMethod(`function foo($bar, Plop $plop);`);
            var arg = phpMethod.findArgumentByName("plop");
            assert.equal("Plop", arg.getType());
        });
        it('should return null for non existing argument', function () {
            var phpMethod = new PhpMethod(`function foo($bar, Plop $plop);`);
            var arg = phpMethod.findArgumentByName("inexistent");
            assert.equal(arg, null);
        });
    });

    describe('#addArgument()', function () {
        it('should add argument', function () {
            var phpMethod = new PhpMethod(`function foo();`);
            phpMethod.addArgument(new PhpFunctionArgument().setName("foo"));
            assert.equal(phpMethod.getCode(), `function foo($foo);`);

            phpMethod.addArgument(new PhpFunctionArgument().setName("plop").setType("Plop"));
            assert.equal(phpMethod.getCode(), `function foo($foo, Plop $plop);`);

            phpMethod.addArgument(new PhpFunctionArgument().setName("test").setType("Test").setValue('"test"'), null);
            assert.equal(phpMethod.getCode(), `function foo(Test $test = "test", $foo, Plop $plop);`);
        });
    });

    describe('#removeArgument()', function () {
        it('should remove argument', function () {
            var phpMethod = new PhpMethod(`function foo($a, Plop $plop, $b, Test $c = "c");`);
            phpMethod.removeArgument(phpMethod.findArgumentByName("plop"));
            assert.equal(phpMethod.getCode(), `function foo($a, $b, Test $c = "c");`);

            phpMethod.removeArgument(phpMethod.findArgumentByName("a"));
            assert.equal(phpMethod.getCode(), `function foo($b, Test $c = "c");`);

            phpMethod.removeArgument(phpMethod.findArgumentByName("c"));
            assert.equal(phpMethod.getCode(), `function foo($b);`);

            phpMethod.removeArgument(phpMethod.findArgumentByName("b"));
            assert.equal(phpMethod.getCode(), `function foo();`);
        });
    });

    describe('#getImplementation()', function () {
        it('should return default implementation', function () {
            var phpMethod = new PhpMethod();
            assert.equal(phpMethod.getImplementation(), `// TODO`);
        });
        it('should return implementation from init', function () {
            var phpMethod = new PhpMethod(`function foo() { /* Test */ }`);
            assert.equal(phpMethod.getImplementation(), `/* Test */`);
        });
    });

    describe('#setImplementation()', function () {
        it('should modify default implementation', function () {
            var phpMethod = new PhpMethod();
            phpMethod.setImplementation(`echo "test";`);
            assert.equal(phpMethod.getCode(), `public function todo()
{
    echo "test";
}`);
        });
        it('should modify implementation from init', function () {
            var phpMethod = new PhpMethod(`public function todo()
{
    // Multiline
    // implementation.
}`);
            phpMethod.setImplementation(`echo "bar";`);
            assert.equal(phpMethod.getCode(), `public function todo()
{
    echo "bar";
}`);
        });
        it('should remove implementation', function () {
            var phpMethod = new PhpMethod();
            phpMethod.setImplementation(null);
            assert.equal(phpMethod.getCode(), `public function todo();`);
        });
        it('should create implementation', function () {
            var phpMethod = new PhpMethod(`public function foo();`);
            phpMethod.setImplementation(`// Test\nfoo();`);
            assert.equal(phpMethod.getCode(), `public function foo()
{
    // Test
    foo();
}`);
        });
    });
});