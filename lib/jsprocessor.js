'use strict';

//
// JSProcessor takes care, and processes JS files.
// It is given:
//   - A base directory, which is the directory under which to look at references files
//   - A destination directory, which is the directory under which will be generated the files
//   - A file content to be processed
//   - a file replacement locator
//   - a destination directory (optional)
//   - an optional log callback that will be called as soon as there's something to log
//
var JSProcessor = module.exports = function (src, dest, content, revvedfinder, logcb) {
  this.content = content;
  this.filepath = src;
  this.linefeed = /\r\n/g.test(this.content) ? '\r\n' : '\n';
  this.revvedfinder = revvedfinder;
  this.logcb = logcb || function () {};
};

//
// Calls the log callback function
//
JSProcessor.prototype.log = function log(msg) {
  this.logcb(msg);
};

// Process the JS file, which is:
//  - replace image references by their revved version
//
JSProcessor.prototype.process = function process() {
  var self = this;
  // Replace reference to images with the actual name of the optimized image
  this.log('Update the JS with new img filenames');
  return this.content.replace(/(src=|url\(\s*)['"]?([^'"\)#?]+)(?:[#?](?:[^'"\)]*))?['"]?\s*\)?/gm, function (match, attribute, src) {
    // Consider reference from site root
    var file = self.revvedfinder.find(src, self.filepath);
    var res = match.replace(src, file);

    if (src !== file) {
      self.log(match + ' changed to ' + res);
    }
    return res;
  });
};
