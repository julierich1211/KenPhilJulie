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
                    app_key: "_app_id=9effb035&_app_key=a9bb7355dceffb0ebf4c559001cad27f"
                 }

                var client = new YummlyClient(options);

            });
        }

function YummlyClient(options) {
    if (!options.app_key) {
        throw new Error("Yo dawg, I heard you like APIs. Y U NO APIKEY?!?!?");
    }
    this.yummly_url = "http://api.yummly.com/v1/api/recipes?";
    this.app_key = options.app_key;
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

    console.dir(data);

    var bigHtmlString = data.matches.results.map(function(index) {
        return _.index(index);

        grid.innerHTML = bigHtmlString;
    })
    // body...
};

YummlyClient.prototype.init = function() {
    var self = this;

    $.when(
        this.getAllRecipes()
        ).then(function(index, indexHtml){
        self.showAllRecipes(indexHtml, index)
        })
    
}