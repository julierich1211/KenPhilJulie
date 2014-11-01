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
            app_key: "a9bb7355dceffb0ebf4c559001cad27f"
            app_id: "9effb035"
        }
        // start app?
        var client = new YummlyClient(options);
    })

}

function YummlyClient(options) {
    if (!options.app_key) {
        throw new Error("Y U NO KEY?!?!?");
    }
    if (!options.app_id) {
        throw new Error("Y U NO ID?!?!?");
    }
    this.yummly_url = "http://api.yummly.com/v1/api/recipes?_app_id=";
    this.api_key = options.app_key;
    this.api_id = ooptions.app_id;
    this.cuisine = "&allowedCuisine[]=cuisine^cuisine-";
    this.pictures = "&requirePictures=true";
    this.complete_api_url = this.yummly_url + this.app_id + "&_app_key=" + this.app_key;
   
    this.setupRouting();
}

YummlyClient.prototype.pullAllActiveListings = function() {
    return $.getJSON(
        this.complete_api_url
    ).then(function(data) {
            return data.matches;
        });
}

YummlyClient.prototype.pullSingleListing = function(id) {
    return $.getJSON(
        this.single
        ).then(function(data) {
        return data.matches;
    });
}

YummlyClient.prototype.loadTemplate = function(name) {
    var self = this;

    $.get('./templates/' + name + '.html').then(function(data) {
            self.templates[name] = data; // <-- cache it for any subsequent requests to this template
            return data;
        });
    }
}

YummlyClient.prototype.drawListings = function(templateString, data) {
    var grid = document.querySelector("#lefty");

    var bigHtmlString = data.matches.map(function(listing) {
        return _.template(templateString, listing);
    }).join('');

    grid.innerHTML = bigHtmlString;
}

YummlyClient.prototype.drawSingleListing = function(template, data) {
    var listing = data[0];
    var grid = document.querySelector("#lefty");
    var bigHtmlString = _.template(template, listing);

    grid.innerHTML = bigHtmlString;
}

YummlyClient.prototype.setupRouting = function() {
    var self = this;

    Path.map("#/").to(function() {
        $.when(
            self.loadTemplate("left"),
            self.pullAllActiveListings()
        ).then(function() {
            self.drawListings(arguments[0], arguments[1]);

            console.dir(self)
        })
    });

    Path.map("#/message/:anymessage").to(function() {
        alert(this.params.anymessage);
    })

    Path.map("#/left/:id").to(function() {
        $.when(
            self.loadTemplate("right"),
            self.pullSingleListing(this.params.id)
        ).then(function() {
            self.drawSingleListing(arguments[0], arguments[1]);
        })
    });

    // set the default hash to draw all listings
    Path.root("#/");
    Path.listen();
}