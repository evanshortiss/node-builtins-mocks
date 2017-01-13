'use strict';

const builtins = require('node-builtins');
const debug = require('debug')(require('./package.json').name);

module.exports = function generateBuiltInMocks (stubGenerator) {
  debug(`generating mocks for the following modules: ${builtins}`);
  const ret = {};

  builtins.forEach(function (modName) {
    debug(`generate mock for ${modName}`);

    const mod = require(modName);
    const mock = {};

    for (var i in mod) {
      if (typeof mod[i] === 'function') {
        debug(`generate mocked function ${i} for ${modName}`);
        // Stub out functions
        mock[i] = stubGenerator();
      } else {
        debug(`copy property ${i} for ${modName} to mock`);
        // Use real constants and properties
        mock[i] = mod[i];
      }
    }

    ret[modName] = mock;
  });

  return ret;
};
