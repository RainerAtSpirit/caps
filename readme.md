#capsJS
[![Build Status](https://travis-ci.org/RainerAtSpirit/caps.png?branch=master)](https://travis-ci.org/RainerAtSpirit/caps)
>  **2014/04/08** supports all methods of Caps version 11.3.0.40

## JavaScript library for CorasWorks Application Service (CAPS) developer

### Quick start: simply grab the latest release from the build directory.

Include `caps.min.js` into your page and start using it via the globally exposed `caps` namespace. `caps` is a utility
library that makes it easier accessing `_layouts/CorasWorksApps/CorasWorksApplicationService.ashx` methods from
JavaScript.

e.g. compare the following ajax request
```javascript
$.ajax('/_layouts/CorasWorksApps/CorasWorksApplicationService.ashx', {
    data: {
        RequestType: 'GetListInfo',
        OutPutType: 'json',
        SiteUrl: '/MT/capsjs',
        ListTitle: 'Test1'
    }
})
.then(...);
```

with the equivalent caps request.
```javascript
caps.getListInfo({listTitle: 'Test1'})
.then(...)
```


### Quick start capsJS core developer:

1. install node from http://nodejs.org
2. install grunt using `npm install -g grunt-cli`
3. download/clone this repo
4. run `npm install` in repo's root directory to install grunt's dependencies
5. run `grunt test` to run tests

###Contributing
Write tests in `test/specs/modules` that describes the desired functionality and implement it in `src/`.
No pull requests will be accepted without associating tests.

In absence of a formal style guide, follow the existing code style.

###Building the app
There's a `grunt build` task that builds an optimized version in the build directory.

###New to grunt?
Head over to http://gruntjs.com/ to learn the basics.