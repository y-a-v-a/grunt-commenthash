
var assert = require('assert');
var fs = require('fs');

suite('grunt-commenthash', function() {
  suite('hashing', function() {
    test('comment addded to file', function() {
      assert.ok(fs.existsSync('out/base/test1.js'));
      assert.equal(fs.readFileSync('out/base/test1.js', 'utf8'), fs.readFileSync('test/fixtures/base/test1.js', 'utf8'));
    });

    test('comment with string template addded to file', function() {
      assert.ok(fs.existsSync('out/template/test1.js'));
      assert.equal(fs.readFileSync('out/template/test1.js', 'utf8'), fs.readFileSync('test/fixtures/template/test1.js', 'utf8'));
    });

    test('comment with template via function addded to file', function() {
      assert.ok(fs.existsSync('out/template_function/test1.js'));
      assert.equal(fs.readFileSync('out/template_function/test1.js', 'utf8'), fs.readFileSync('test/fixtures/template_function/test1.js', 'utf8'));

      assert.ok(fs.existsSync('out/template_function/test2.js'));
      assert.equal(fs.readFileSync('out/template_function/test2.js', 'utf8'), fs.readFileSync('test/fixtures/template_function/test2.js', 'utf8'));
    });

    test('directory structure intact', function() {
      assert.ok(fs.existsSync('out/template_function/subdir/test3.js'));
      assert.equal(fs.readFileSync('out/template_function/subdir/test3.js', 'utf8'), fs.readFileSync('test/fixtures/template_function/subdir/test3.js', 'utf8'));
    });

    test('adding both banner and footer', function() {
      assert.ok(fs.existsSync('out/banner_footer/test1.js'));
      assert.equal(fs.readFileSync('out/banner_footer/test1.js', 'utf8'), fs.readFileSync('test/fixtures/banner_footer/test1.js', 'utf8'));
    });
  });
});
