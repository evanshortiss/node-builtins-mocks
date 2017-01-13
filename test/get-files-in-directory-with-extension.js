'use strict';

const fs = require('fs');
const path = require('path');

// read all files in a directory and return those with a given extension
module.exports = function (dir, extension) {
  return fs.readdirSync(dir).filter((filename) => {
    return path.extname(filename) === extension;
  });
};
