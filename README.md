# A/B-Testing from A to Z
This repository attempts to give you a way to make your A/B-Testing easier. 
It consists of two things:   
1. A [library for serving multiple distributions](https://github.com/navikt/ab-test/tree/main/packages/ab-test-middleware) of your frontend code.
2. A [GitHub Action that builds distributions](https://github.com/navikt/ab-test/tree/main/actions/build) based from your repository.

The main idea is to leverage multiple git branches in order to enable faster iterations on frontend implementations.
By doing this, a team can easily try out an idea on a specific set of users without worrying about the implications
this may have on the everyday operations of a specific frontend application. 

The proposed tools allow for test branches to be deployed through a feature toggle
controlled distribution, allowing to not only define the test group size, but also
making it possible to instantly disable a distribution. Hopefully this will enable
teams to experiment on new ideas more eagerly and risk-free.   
 
