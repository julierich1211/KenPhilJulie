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
          var beer = new beerMe (options); 

});
}

function beerMe(options) {
  if (!options.api_key) {
    throw new Error ("Wrong");
  }
  this.brewerydb_url = "http: //api.brewerydb.com/";
  this.version = "v2/";
  this.branch = "styles?key="
  this.api_key = options.api_key;
  this.complete_api_url = this.brewerydb_url + this.version;

  this.init();
  console.log (this.branch);
}