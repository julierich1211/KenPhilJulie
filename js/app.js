window.onload = app;

// runs when the DOM is loaded
function app() {

        // load some scripts (uses promises :D)
        loader.load({
            url: "./bower_components/jquery/dist/jquery.min.js"
        }, {
            url: "./bower_components/lodash/dist/lodash.min.js"
        }, {
            url: "./bower_components/pathjs/path.min.js"
        }).then(function() {
            _.templateSettings.interpolate = /{([\s\S]+?)}/g;

            var options = {
              api_key: "c6e086abdb374e9c5b9de44506e25ecb"
            }
            // start app?
          var beer = new Beerme (options); 
          })
}