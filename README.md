# node-builtins-mocks

Generates mocks for all node-builtins. Builtins are modules such as fs, url,
path, and http.

## Why?

Because I'm lazy, and writing this:

```js
const generateMocks = require('node-builtins-mocks');
const sinon = require('sinon');
const mocks = generateMocks(sinon.stub);
```

is faster than writing this:

```js
const sinon = require('sinon');
const mocks = {
  fs: {
    readdir: sinon.stub(),
    createReadStream: sinon.stub()
  },
  os: {
    platform: sinon.stub()
  },
  crypto: {
    createHash: sinon.stub()
  }
};
```

## Install

```bash
# install and persist to "devDependencies" in package.json

npm i node-builtins-mocks -D
```

## Usage

### basic usage example

Below we use sinon.stub, but you can pass any function to be used as a stub generator:

```js
// we will use the stub method from sinon as a stub generator for mocks
const sinon = require('sinon');

// this function will allow us to generate all the mocks we need...
const generateMocks = require('node-builtins-mocks')

// .. and now we have some mocks that we can configure
const mocks = generateMocks(sinon.stub);

// make the "fs.readdir" mock return data
mocks.fs.readdir.yields(null, ['index.html', 'favicon.ico']);

// or make dns lookups fail
mocks.dns.resolve.yields(new Error('EADDRNOTAVAIL'));
```


### advanced usage example

Bear in mind, this is just an example of usage, if you don't like `proxyquire`,
`mocha`, or `sinon` for testing you can use different mocking modules or
techniques.

`proxyquire` is a neat module for stubbing dependencies during testing. Here's
an example of how we can mock out the `fs` module using `node-builtins-mocks`
and `proxyquire`.

Here's our module:

```js
const fs = require('fs'); // we're going to stub this out for tests
const path = require('path');

// read all files in a directory and return those with a given extension
module.exports = function (dir, extension) {
  return fs.readdirSync(dir).filter((filename) => {
    return path.extname(filename) === extension;
  });
};
```

And a test for it:

```js
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const mocks = require('node-builtins-mocks')(sinon.stub);
const assert = require('assert');

var getFiles = proxyquire('./get-files-in-directory-with-extension.js', {
  // proxyquire will inject this fs stub instead of the real fs module when
  // get-files-in-directory-with-extension.js calls "require('fs')"
  fs: mocks.fs
});

describe('get-files', function () {
  it('should return 2 .js files', function () {
    // make our stub return a fake file list
    mocks.fs.readdirSync.returns(['a.html', 'b.js', 'c.js']);

    // call function that relies on our fs.readdirSync stub
    const files = getFiles('./', '.js');

    // only .js files should have been returned as per our stub
    assert.equal(files.length, 2);
    assert.deepEqual(files, ['b.js', 'c.js']);
  });
});
```

## API

### generateMocks(stubGenerator)
