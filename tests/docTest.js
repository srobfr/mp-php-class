var PhpDoc = require(__dirname + "/../PhpDoc.js");
var PhpDocAnnotation = require(__dirname + "/../PhpDocAnnotation.js");
var assert = require('assert');

describe('PhpDoc', function () {
    describe('#getDescription()', function () {
        it('should return default description', function () {
            var phpDoc = new PhpDoc();
            assert.equal(phpDoc.getDescription(), "TODO");
            assert.equal(phpDoc.getCode(), `/**
 * TODO
 */`);
        });
        it('should return description from init', function () {
            var phpDoc = new PhpDoc(`/** 
* FooBar
*/`);
            assert.equal(phpDoc.getDescription(), "FooBar");
        });
    });

    describe('#setDescription()', function () {
        it('should modify default description', function () {
            var phpDoc = new PhpDoc();
            phpDoc.setDescription("New description");
            assert.equal(phpDoc.getDescription(), "New description");
            assert.equal(phpDoc.getCode(), `/**
 * New description
 */`);
        });
        it('should modify description from init', function () {
            var phpDoc = new PhpDoc(`/** 
* FooBar
*/`);
            phpDoc.setDescription("New description");
            assert.equal(phpDoc.getDescription(), "New description");
        });
    });

    describe('#getLongDescription()', function () {
        it('should return empty default long description', function () {
            var phpDoc = new PhpDoc();
            assert.equal(phpDoc.getLongDescription(), "");
        });
        it('should return long description from init', function () {
            var phpDoc = new PhpDoc(`/** 
* FooBar
*
* Long desc
* Multilines !
*/`);
            assert.equal(phpDoc.getLongDescription(), "Long desc\nMultilines !");
        });
    });

    describe('#setLongDescription()', function () {
        it('should create long description', function () {
            var phpDoc = new PhpDoc();
            phpDoc.setLongDescription("FooBar");
            assert.equal(phpDoc.getCode(), `/**
 * TODO
 *
 * FooBar
 */`);
        });

        it('should modify long description', function () {
            var phpDoc = new PhpDoc();
            phpDoc.setLongDescription("FooBar").setLongDescription("Test.");
            assert.equal(phpDoc.getCode(), `/**
 * TODO
 *
 * Test.
 */`);
        });

        it('should delete long description', function () {
            var phpDoc = new PhpDoc();
            phpDoc.setLongDescription("FooBar").setLongDescription(null);
            assert.equal(phpDoc.getCode(), `/**
 * TODO
 */`);
        });
    });

    describe('#getAnnotations()', function () {
        it('should return no annotations on default', function () {
            var phpDoc = new PhpDoc();
            assert.deepEqual(phpDoc.getAnnotations(), []);
        });
        it('should return annotations from init', function () {
            var phpDoc = new PhpDoc(`/**
 * TODO
 * @foo
 * @bar Bar
 */`);
            var annotations = phpDoc.getAnnotations();
            assert.equal(annotations.length, 2);
            var fooAnnotation = annotations[0];
            assert.equal(fooAnnotation.getName(), "foo");
        });
    });

    describe('#addAnnotation()', function () {
        it('should add an annotation when the phpdoc has only a description', function () {
            var doc = new PhpDoc();
            var annotation = new PhpDocAnnotation().setName("foo").setValue("Foo.");
            doc.addAnnotation(annotation);
            assert.equal(doc.getCode(), `/**
 * TODO
 *
 * @foo Foo.
 */`);
        });
        it('should add an annotation when the phpdoc has a long description', function () {
            var doc = new PhpDoc();
            doc.setLongDescription("My long\ndescription.");
            var annotation = new PhpDocAnnotation().setName("foo").setValue("Foo.");
            doc.addAnnotation(annotation);
            assert.equal(doc.getCode(), `/**
 * TODO
 *
 * My long
 * description.
 *
 * @foo Foo.
 */`);
        });
        it('should add an annotation in first position', function () {
            var doc = new PhpDoc();
            doc.addAnnotation(new PhpDocAnnotation().setName("foo").setValue("Foo."));
            doc.addAnnotation(new PhpDocAnnotation().setName("bar").setValue("Bar."), null);
            assert.equal(doc.getCode(), `/**
 * TODO
 *
 * @bar Bar.
 *
 * @foo Foo.
 */`);
        });
        it('should add an annotation after another annotation', function () {
            var doc = new PhpDoc();
            var bar = new PhpDocAnnotation().setName("bar").setValue("Bar.");
            doc.addAnnotation(bar);
            doc.addAnnotation(new PhpDocAnnotation().setName("foo").setValue("Foo."), bar);
            assert.equal(doc.getCode(), `/**
 * TODO
 *
 * @bar Bar.
 *
 * @foo Foo.
 */`);
        });
        it('should add an annotation after another annotation with the same name', function () {
            var doc = new PhpDoc();
            var bar = new PhpDocAnnotation().setName("test").setValue("Bar.");
            doc.addAnnotation(bar);
            doc.addAnnotation(new PhpDocAnnotation().setName("test").setValue("Foo."), bar);
            assert.equal(doc.getCode(), `/**
 * TODO
 *
 * @test Bar.
 * @test Foo.
 */`);
        });
        it('should add an annotation after another annotation with a different name', function () {
            var doc = new PhpDoc();
            doc.addAnnotation(new PhpDocAnnotation().setName("test").setValue("Foo."));
            doc.addAnnotation(new PhpDocAnnotation().setName("testA").setValue("C."));
            doc.addAnnotation(new PhpDocAnnotation().setName("test").setValue("Bar."));

            assert.equal(doc.getCode(), `/**
 * TODO
 *
 * @test Bar.
 * @test Foo.
 *
 * @testA C.
 */`);
        });
        it('should add an annotation after all other annotations', function () {
            var doc = new PhpDoc();
            var foo = new PhpDocAnnotation().setName("foo").setValue("Foo.");
            doc.addAnnotation(foo);
            doc.addAnnotation(new PhpDocAnnotation().setName("bar").setValue("Bar."), foo);

            assert.equal(doc.getCode(), `/**
 * TODO
 *
 * @foo Foo.
 *
 * @bar Bar.
 */`);
        });
    });
    describe('#removeAnnotation()', function () {
        it('should remove an annotation from init code', function () {
            var doc = new PhpDoc(`/**
 * TODO
 *
 * @foo Bar 0.
 * @foo Foo 1.
 * @foo Baz 2.
 * @plop Plop 3.
 */`);
            var annotations = doc.getAnnotations();
            doc.removeAnnotation(annotations[2]);
            assert.equal(doc.getCode(), `/**
 * TODO
 *
 * @foo Bar 0.
 * @foo Foo 1.
 *
 * @plop Plop 3.
 */`);
            doc.removeAnnotation(annotations[0]);
            assert.equal(doc.getCode(), `/**
 * TODO
 *
 * @foo Foo 1.
 *
 * @plop Plop 3.
 */`);
            doc.removeAnnotation(annotations[1]);
            assert.equal(doc.getCode(), `/**
 * TODO
 *
 * @plop Plop 3.
 */`);
            doc.removeAnnotation(annotations[3]);
            assert.equal(doc.getCode(), `/**
 * TODO
 */`);
        });
    });
});