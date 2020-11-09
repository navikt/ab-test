# ab-test-middleware
A middleware that provides an easy way to serve multiple distributions in order to run A/B/N tests.

_**NOTE: The middleware expects a set of production ready distributions to be built prior to using it on an app.**_ 

## Usage (the TL;DR version) 

Assuming your distributions are built already and available in your `build` folder.
I suggest using [navikt/ab-test/actions/build@v1](https://github.com/navikt/ab-test/tree/main/actions/build) 
if you're running your deployments by means of GitHub Actions.
The `build` folder should be created with the following structure:
```
build/
 ├── release-v1.0.0
 ├── new-design
 ├── ...
 └── login-button-placement
``` 

```javascript
const express = require('express');
const { createAbTestMiddleware } = require('ab-test-middleware');

const app = express();

/**
* A function to assign a test group to an inconming request.
* @param {string} distName Distribution name sent the middleware in order 
* to know whether to assign that particular distribution to the request or not. 
* A cookie will be set in the response if the function returns a true value.  
* @returns {boolean} Boolean value that determines if the user is to be assigned 
* to the distribution's test group. 
*/
const testGroupToggleInterpreter = (distName) => {
    let enabled = false;
    // Write your logic here. Alternately make use of a feature toggle mechanism here.    
    return enabled;
}

/**
* A function that checks whether distributions are enabled and should be servable.
* @param {string} distName Distribution name sent the middleware in order to know
* whether that particular distribution is enabled or not. Disabled distributions
*  will not be served and lead to the re-assignation of a request to a different distribution.  
* @returns {boolean} Boolean value that determines if the distribution is enabled and servable. 
*/
const distributionToggleInterpreter = (distName) => {
    let enabled = false;
    // Write your logic here. Alternately make use of a feature toggle mechanism here.    
    return enabled;
}

app.use(createAbTestMiddleware({
  defaultDist: 'release-v1.0.0',            // name of the distribution (default: 'master')
  distFolder: 'build',                      // name of the distribution folder (default: 'dist') 
  cookieName: 'distributionName',           // name of the cookie to be set on test group assignation (default: 'testGroup')
  entryFile: 'landing-page.html',           // name of the entry file for your distribution (default: 'index.html')
  ingresses: ['/'],                         // array containing application ingresses (default: ['/'])
  randomizeTestGroupDistribution: true,     // whether to randomize the test group assignation (default: false)
  testGroupToggleInterpreter: testGroupToggleInterpreter,
  distributionToggleInterpreter: distributionToggleInterpreter,
}));

app.listen(3000);
``` 

#### Note: 
If the `randomizeTestGroupDistribution` flag is omitted or set to `false`, it will result in 
an alphabetically ordered loop when assigning test groups to requests in the middleware. 
It is _**highly**_ recommended to set this flag to true in cases where the `testGroupToggleInterpreter` 
does not account for randomization or does not count on a persistent distribution assignation 
tracking mechanism such as a feature toggle service.  

