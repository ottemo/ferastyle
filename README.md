Storefront
==========

[![wercker status](https://app.wercker.com/status/e115eef144560e16f26e4979cec78b28/m "wercker status")](https://app.wercker.com/project/bykey/e115eef144560e16f26e4979cec78b28)

## Workflow with gulp

### Build
Builds project and moves files on the destination folder. Makes concat and minify css and JS. Compiling SASS to css. Checks JS on errors using JSHint

    gulp build
    
### Run Client in Development Mode
Moves images, bower-files into destination folder. Compiling sass. Adds watcher on a changes in css, scss, js, html and images. After a change these files browser automatically will be update  content

    gulp build && gulp dev
    or
    gulp build && gulp serve
    
### Run Unit Tests
Not configured yet. Will be realized in the near future
    
    gulp test
        
### Also useful are the following commands
    gulp jshint // check js on errors
    gulp sass   // Makes compilation sass to css
    gulp clean  // Removes the _dist_ folder
    
