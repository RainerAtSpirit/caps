#capsJS
[![Build Status](https://travis-ci.org/RainerAtSpirit/caps.png?branch=master)](https://travis-ci.org/RainerAtSpirit/caps)
>  **2013/03/10** Preliminary release. Not all caps methods are implemented yet.

## JavaScript library for CorasWorks Application Service (CAPS) developer

### Quick start: simply grab the latest release from the build directory.

Include `caps.min.js` into your page and start using it. caps is a utility library
that allow easier access to `_layouts/CorasWorksApps/CorasWorksApplicationService.ashx` methods.

e.g. compare the following ajax request
```javascript
$.ajax('/_layouts/CorasWorksApps/CorasWorksApplicationService.ashx', {
    data: {
        RequestType: 'GetListInfo',
        OutPutType: 'json',
        SiteUrl: '/MT/capsjs',
        ListTitle: 'Test1'
    }
});
```

with it's equivalent caps request.
```javascript
caps.getListInfo({listTitle: 'Test1'})
```




### Quick start CapsJS core developer:

1. install node from http://nodejs.org
2. install grunt using `npm install -g grunt-cli`
3. download/clone this repo
4. run `npm install` in repo's root directory to install grunt's dependencies
5. run `grunt` run tests in the test directory

###Contributing
Write tests in `test/srcSpecs` that describes the desired functionality and implement in `src/`.
No pull requests will be accepted without associating tests.

In absence of a formal style guide, follow the existing code style as close as possible.

###Building the app
Experimental: There's a `grunt build` task that builds an optimized version in the build directory.

###New to grunt?
Head over to http://gruntjs.com/ to learn the basics.