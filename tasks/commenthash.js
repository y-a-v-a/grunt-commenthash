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
  var getHash = require('../lib/hash');

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md
  // 
  
  /**
   * Returns longest string in an array
   * @param  {array} strings Array filled with strings
   * @return {string}       Longest string in strings array
   */
  function getLongestString(strings) {
    strings.sort(function(a, b) {
      var aVal = a.toString().length;
      var bVal = b.toString().length;

      if(aVal === bVal) { return 0; }
      return aVal > bVal ? -1 : 1;
    });

    return strings[0];
  }

  /**
   * Returns the last index where item matched with regexp is found.
   * @param  {string} string Input string
   * @param  {regexp} regex  Regular expression
   * @return {int}        Index
   */
  function lastIndexOfRegex(string, regex) {
    var matches = string.match(regex);
    return matches && matches.length > 0 ? string.lastIndexOf(getLongestString(matches)) : -1;
  }

  function parseComment(type, options, data) {
    if(!type) {
      type = 'footer';
    }

    var template = options[type];

    switch (typeof template) {
    case 'boolean':
      template = template ? defaultTemplate : '';
      break;
    case 'string':
      var rawOptions = grunt.config.getRaw(grunt.task.current.name + '.' + grunt.task.current.target + '.options');

      if(rawOptions && rawOptions[type]) {
        template = rawOptions[type];
      }
      break;
    case 'function':
      template = template(data);
      if(typeof template === 'boolean' && template) {
        template = defaultTemplate;
      }
      break;
    }

    return template ? grunt.template.process(template, {data: data}) : '';
  }

  /**
   * Add comment to source string.
   * @param  {string} type        Either footer or banner
   * @param  {string} src         Path to source file
   * @param  {string} source      Contents of source file
   * @param  {object} options     Supplied options to this plugin
   * @param  {string} commentText Comment text
   * @return {string}             Source with comment added
   */
  function insertComment(type, src, source, options, commentText) {
    var ext = path.extname(src);

    var insertIndex = -1;
    var comment = '';

    if(type === 'banner') {
      insertIndex = 0;
    }

    if(commentText) {
      switch (ext.toLowerCase()) {
      case '.css':
        comment = '/*' + commentText + '*/';
        break;
      case '.js':
        comment = '/*!' + commentText + '*/';

        // If it's a footer then insert comment before sourceMappingURL
        if(options.beforeSourceMap && insertIndex === -1) {
          var sourceMapRegex = /\/\/[@#]\s+sourceMappingURL=(.+)/;
          var sourceMapRegex2 =  /\/\*#\s+sourceMappingURL=([^\s]+)\s+\*\//;
          if(sourceMapRegex.test(source) || sourceMapRegex2.test(source)) {
            insertIndex = source.lastIndexOf('//;//#');

            if(insertIndex === -1) {
              insertIndex = sourceMapRegex.test(source) ? lastIndexOfRegex(source, sourceMapRegex) : lastIndexOfRegex(source, sourceMapRegex2);
            }
          }
        }
        break;
      case '.html':
        comment = '<!--' + commentText + '-->';
        break;
      case '.php':
        comment = '<?php /*' + commentText + '*/ ?>';
        break;
      }

      if(insertIndex === 0) {
        // Insert comment at the top (banner)
        return comment + source;
      } else if(insertIndex !== -1) {
        // Insert comment at specific position (before sourceMap)
        return source.substring(0, insertIndex) + comment + source.substring(insertIndex, source.length);
      } else {
        // Insert comment at the end (footer)
        return source + comment;
      }
    }

    return source;
  }

  // ==========================================================================
  // TASKS
  // ==========================================================================

  var defaultTemplate = '<%= commenthash.value %>';
  var defaultOptions = {
    hashLength: 8,
    hashFunction: getHash,
    banner: '',
    footer: defaultTemplate,
    beforeSourceMap: true
  };

  grunt.registerMultiTask('commenthash', 'Append a unique hash to the contents of a file for file comparison.', function () {
    var options = this.options(defaultOptions);

    this.files.forEach(function (file) {
      file.src.forEach(function (src) {
        var source = grunt.file.read(src);
        var hash = options.hashFunction(source, 'utf8').substr(0, options.hashLength);
        var filename = path.basename(src);

        // Default destination to the same directory
        var dest = file.dest || src;
        if(dest.indexOf(filename) === -1) {
          dest = path.join(dest, filename);
        }

        var templateData = {
          commenthash: {
            value: hash
          },
          src: src,
          dest: dest,
          filename: filename
        };

        var footer = parseComment('footer', options, templateData);
        var banner = parseComment('banner', options, templateData);
        var targetSource = source;
        var action = 'Processed';

        if(footer) {
          targetSource = insertComment('footer', src, targetSource, options, footer);
        }

        if(banner) {
          targetSource = insertComment('banner', src, targetSource, options, banner);
        }

        if(source === targetSource) {
          action = 'Unchanged';
        }

        if(source !== targetSource) {
          if(src !== dest) {
            action = 'Generated';
          }
          grunt.file.write(dest, targetSource);
        } else if(src !== dest) {
          action = 'Copied';
          grunt.file.copy(src, dest);
        }
        
        grunt.log.writeln(chalk.green('✔ ') + chalk.bold(action + ': ') + dest);
      });
    });
  });
};