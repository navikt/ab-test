# ab-test distribution builder

This GitHub Action provides an easy way to create an [ab-test-middleware](https://github.com/navikt/ab-test/tree/main/packages/ab-test-middleware)
compatible distribution folder. 

## Usage
- Introduce the following step at the appropriate point in your GitHub Actions pipeline:
```yaml
  - uses: navikt/ab-test/actions/build@v1
    with:
      master-branch: release             # default: 'master'
      test-branch-prefix: hypothesis/    # default: 'ab-test/'
      build-script: build-production     # default: 'build'
      dist-directory: my_dist_folder     # default: 'dist'
      output-directory: build            # default: 'dist'
```
**Note that should be triggered by changes to _both_ your default release branch
_and_ your test branches.**

### Explanation
All inputs are optional and have a default value. 

#### master-branch
Refers to the branch that is usually deployed to production and acts as the release-standard. 
This defaults to master as most teams seem to release the master branch into production, though
it can be changed to any value. The build process will then start by building this branch and end
by changing back to it. 

#### test-branch-prefix
As implied, it specifies the prefix used on the branches that are to be used for testing. 
All branches will be iterated through and a distribution will be built by means of the specified
build script running.

#### build-script
The scrip that is to be run in order to create a distribution build. The build process will
first run `npm install` and then `npm run build-script`.

#### dist-directory
Specifies the directory that your `build-script` outputs to. All files within this directory
are copied to a temporary folder named after the branch minus the `test-branch-prefix` (if applicable).

#### output-directory
Specifies the desired output directory. Contents stored in the temporary folder during the build
step will be moved to said directory and can then be used by other steps in your pipeline. A clear
example of this would be a `docker build` step where you could copy the `output-directory` into your
docker image.   
