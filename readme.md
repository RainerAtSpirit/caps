#capsJS
[![Build Status](https://travis-ci.org/RainerAtSpirit/caps.png?branch=master)](https://travis-ci.org/RainerAtSpirit/caps)
>  **2013/10/24** Preliminary release

### Quick start

**End-user, system-builder** simply grab the latest release from the build directory.

**Caps architects**:

1. install node from http://nodejs.org
2. install grunt using `npm install -g grunt-cli`
3. download/clone this repo
4. run `npm install` in repo's root directory to install grunt's dependencies
5. run `grunt` run tests in the test directory

###Adding caps methods
Start by copying a existing method folder in `test/srcSpecs` and write some initial tests.
Copy an existing method folder in `src` and add the required functionality.
Helper function should go into `src/fn.js`, whenever done add the new method to `src/caps.js`


###Building the app
Experimental: There's a `grunt build` task that builds an optimized version in the build directory.

###New to grunt?
Head over to http://gruntjs.com/ to learn the basics.