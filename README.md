# grunt-commenthash [![Build Status](https://travis-ci.org/meinaart/grunt-commenthash.svg?branch=master)](https://travis-ci.org/meinaart/grunt-commenthash)

Calculates a unique hash of a file. This hash will be added as a comment to javascript, CSS, PHP and HTML files.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-commenthash --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-commmenthash');
```

*This plugin was designed to work with Grunt 0.4.x. If you're still using grunt v0.3.x it's strongly recommended that [you upgrade](http://gruntjs.com/upgrading-from-0.3-to-0.4).*

[grunt]: http://gruntjs.com/
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md

## Documentation

```javascript
grunt.initConfig({
	commenthash: {
		options: {
      hashLength: 8, // hash length, the max value depends on your hash function
      hashFunction: function(source, encoding) { // default is md5
        return require('crypto').createHash('sha1').update(source, encoding).digest('hex');
      },
      footer: '<%= grunt.template.today("yyyy-mm-dd") %> - <%= commenthash.value %>', // Comment text template
      banner: false // Can be true, false, a string or a function that returns a template/boolean. Function retrieves some metadata.
    },
    expand: true,
    cwd: 'src/',
    src: '**/*.js',
    dest: 'dist/'
	}
});
grunt.loadNpmTasks('grunt-commenthash');
```

Configuration follow the multi-task standard configuration format: http://gruntjs.com/configuring-tasks

```javascript
grunt.initConfig({
  commenthash: {
    options: {
      footer: false,
      banner: function(data) {
        if(data.src === 'src/test1.js') {
          return 'test1 - <%= commenthash.value %>';
        } else {
          return true;
        }
      }
    },
    expand: true,
    cwd: 'src/',
    src: '**/*.js',
    dest: 'dist/'
  }
});
grunt.loadNpmTasks('grunt-commenthash');
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## License
Based on the hard work of grunt-hash creator Greg Allen:
https://github.com/jgallen23/grunt-hash

Copyright (c) 2014 Meinaart van Straalen
Licensed under the MIT license.
