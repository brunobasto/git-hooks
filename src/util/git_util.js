'use strict';

var path = require('path');

module.exports = {
  extractFilePath: function(str) {
    var match = /[\.\w\-\_+\/]+\.\w+?/ig.exec(str);

    if (match && match.length) {
      return path.resolve(path.normalize(match[1]));
    }

    return str;
  }
};
