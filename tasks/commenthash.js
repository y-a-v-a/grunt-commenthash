/*
 * grunt-filehash
 *
 * Based on the hard work of grunt-hash creator Greg Allen:
 * https://github.com/jgallen23/grunt-hash
 * *
 * Homepage: 
 * https://github.com/meinaart/grunt-commenthash
 * 
 * Copyright (c) 2012 Greg Allen
 * Copyright (c) 2014 Meinaart van Straalen
 * Licensed under the MIT license.
 */
module.exports = function (grunt) {
  var chalk = require('chalk');
  var path = require('path');
  var fs = require('fs');
  var getHash = require('../lib/hash');

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('commenthash', 'Append a unique hash to the contents of a file for file comparison.', function () {
    var options = this.options({
      hashLength: 8,
      hashFunction: getHash,
      template: '<%= commenthash.value %>',
      prefix: '',
      suffix: ''
    });

    var rawOptions;

    this.files.forEach(function (file) {
      file.src.forEach(function (src) {
        var source = grunt.file.read(src);
        var hash = options.hashFunction(source, 'utf8').substr(0, options.hashLength);
        var ext = path.extname(src);
        var filename = path.basename(src);

        // Default destination to the same directory
        var dest = file.dest || src;
        if(dest.indexOf(filename) === -1) {
          dest = path.join(dest, filename);
        }

        var action = 'Generated';
        var comment = '';
        var commentTemplate = options.template;
        var templateData = {
          commenthash: {
            value: hash
          },
          src: src,
          dest: dest
        };
        if (options.template) {
          switch (typeof options.template) {
          case 'string':
            if (!rawOptions) {
              rawOptions = grunt.config.getRaw(grunt.task.current.name + '.' + grunt.task.current.target + '.options');
            }
            if(rawOptions) {
              commentTemplate = rawOptions.template;
            }
            break;
          case 'function':
            commentTemplate = options.template(templateData);
            break;
          }
        }

        var commentText = grunt.template.process(commentTemplate, {data: templateData});
        switch (ext.toLowerCase()) {
        case '.css':
        case '.js':
          comment = options.prefix + '/*!' + commentText + '*/' + options.suffix;
          break;
        case '.html':
          comment = options.prefix + '<!--' + commentText + '-->' + options.suffix;
          break;
        case '.php':
          comment = options.prefix + '<?php /*' + commentText + '*/ ?>' + options.suffix;
          break;
        }

        if (src === dest) {
          action = 'Processed';
          fs.appendFileSync(src, comment);
        } else {
          grunt.file.write(dest, source + comment);
        }
        grunt.log.writeln(chalk.green('✔ ') + chalk.bold(action + ': ') + dest);
      });
    });
  });
};