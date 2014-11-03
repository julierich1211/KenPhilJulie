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
            app_key: "b5ba65d32dc965e46b6a000b8c532a56",
            app_id: "db9d8943"
        };
        // start app?
        var client = new YummlyClient(options);
    });

}

function YummlyClient(options) {
    if (!options.app_key) {
        throw new Error("Y U NO KEY?!?!?");
    }
    if (!options.app_id) {
        throw new Error("Y U NO ID?!?!?");
    }
    this.yummly_url = "http://api.yummly.com/v1/api/recipes?_app_id=";
    this.app_key = options.app_key;
    this.app_id = options.app_id;
    this.cuisine = "&allowedCuisine[]=cuisine^cuisine-";
    this.course = "&allowedCourse[]=course^course-";
    this.pictures = "&requirePictures=true";
    this.complete_api_url = this.yummly_url + this.app_id + "&_app_key=" + this.app_key;

    this.setupRouting();

    console.log("set up routing works");

}

// from Shawn/Adam attempting to undertsand the 
// use & creation of an input object for forms
YummlyClient.prototype.createInputObject = function() {
    "use strict";
    var input = {};
    $('input').each(function() {
        input[this.name] = this.value;
    });

    return input;
};

YummlyClient.prototype.takeRecipes = function() {

    var input = this.createInputObject();

    return $.getJSON(
        this.complete_api_url + this.course + input.course + this.cuisine + input.cuisine
    ).then(function(data) {
console.log("hello");
        return data;
    });
};

/*YummlyClient.prototype.takeSingleRecipe = function(id) {
    return $.getJSON(
        this.single
        ).then(function(data) {
        return data.matches;
    });
};*/

YummlyClient.prototype.loadTemplate = function(name) {
    return $.get('./templates/' + name + '.html').then(function(data) {
        return data;
    });
};

YummlyClient.prototype.giveRecipes = function(data, html) {
    var grid = document.querySelector("#lefty");

    var bigHtmlString = data.matches.map(function(html) {
        return _.template(data, html);
    }).join('');

    grid.innerHTML = bigHtmlString;
};


/*YummlyClient.prototype.giveSingleRecipe = function(template, data) {
    var listing = data[0];
    var grid = document.querySelector("#lefty");
    var bigHtmlString = _.template(template, listing);

    grid.innerHTML = bigHtmlString;
}*/

YummlyClient.prototype.setupRouting = function() {
    var self = this;
    Path.map("#/results").to(function() {
        $.when(
            self.takeRecipes(),
            self.loadTemplate("recipeResults")
        ).then(function(data, recipeResultsHtml) {
            self.giveRecipes(data, recipeResultsHtml);

            console.log(self);
        });
    });


    /*Path.map("#/left/:id").to(function() {
        $.when(
            self.loadTemplate("right"),
            self.takeSingleRecipe(this.params.id)
        ).then(function() {
            self.giveSingleRecipe(arguments[0], arguments[1]);
        })
    });*/

    // set the default hash to draw all listings
    Path.root("#/");
    Path.listen();
};
