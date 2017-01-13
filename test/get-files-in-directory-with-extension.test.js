'use strict';

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const mocks = require('../index.js')(sinon.stub);
const assert = require('assert');

var getFiles = proxyquire('./get-files-in-directory-with-extension.js', {
  fs: mocks.fs
});

describe('get-files', function () {
  it('should return 2 .js files', function () {
    // Make our stub return a fake file list
    mocks.fs.readdirSync.returns(['a.html', 'b.js', 'c.js']);

    const files = getFiles('./', '.js');

    assert.equal(files.length, 2);
    assert.deepEqual(files, ['b.js', 'c.js']);
  });
});
