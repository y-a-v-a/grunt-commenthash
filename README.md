# grunt-hash

Calculates a unique hash of a file. This hash will be added as a comment to javascript, CSS, PHP and HTML files.

##Grunt 0.4

This task depends on grunt 0.4.x. 

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-commenthash`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-commmenthash');
```

[grunt]: http://gruntjs.com/
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md

## Documentation

```javascript
grunt.initConfig({
	commenthash: {
		options: {
			hashLength: 8, // hash length, the max value depends on your hash function
			hashFunction: function(source, encoding){ // default is md5
				return require('crypto').createHash('sha1').update(source, encoding).digest('hex');
			},
      template: '<%= grunt.template.today("yyyy-mm-dd") %> - <%= commenthash.value %>' // Template for comment text, do not include comment wrapper as this is extension specific
		},
    expand: true,
    cwd: 'src/',
    src: '**/*.js',
    dest: dist/'
	}
});
grunt.loadNpmTasks('grunt-commenthash');
```

Configuration follow the multi-task standard configuration format: http://gruntjs.com/configuring-tasks


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## License
Based on the hard work of grunt-hash creator Greg Allen: https://github.com/jgallen23/grunt-hash
Copyright (c) 2012 Greg Allen  
Copyright (c) 2014 Meinaart van Straalen
Licensed under the MIT license.

