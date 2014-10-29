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
                    app_key: "_app_id=a383b8866&_app_key=641fc30357e1eab237c43afe7cb15d59"
                 }

                var client = new YummlyClient(options);

            });
        }

function YummlyClient(options) {
    if (!options.app_key) {
        throw new Error("Yo dawg, I heard you like APIs. Y U NO APIKEY?!?!?");
    }
    this.yummly_url = "http://api.yummly.com/v1/api/recipes?";
    this.api_key = options.api_key;
    this.complete_api_url = this.yummly_url + options.app_key + "&q=soup"; 
    //instead of "?" we could put something so that the user types in what they are looking for i.e. soup, cake, steak, etc..
    this.init();

}

YummlyClient.prototype.getAllRecipes = function() {
    return $.getJSON(this.complete_api_url)
    .then(function(data) {
        console.log(data.matches)
        return data.matches;
    });
    }

YummlyClient.prototype.showAllRecipes = function(data) {
    var grid = document.querySelector("body");

    // body...
};

YummlyClient.prototype.init = function() {
    var self = this;

    $.when(
        this.getAllRecipes()
        ).then(function(){
        self.showAllRecipes
        })
    
}
;