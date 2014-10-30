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
        // start app?
        var client = new YummlyClient(options);
    })

}

function YummlyClient(options) {
    if (!options.app_key) {
        throw new Error("Y U NO APIKEY?!?!?");
    }
    this.yummly_url = "http://api.yummly.com/v1/api/recipes?";
    this.api_key = options.app_key;
    this.search = "&q=pumpkin";
    this.cuisine = "&allowedCuisine[]=cuisine^cuisine-southwestern";
    this.results = "&maxResult=1&start=1";
    this.complete_api_url = this.yummly_url + options.app_key;
   
    this.setupRouting();
}

YummlyClient.prototype.pullAllActiveListings = function() {
    return $.getJSON(
        this.complete_api_url + this.search + this.cuisine
    ).then(function(data) {
            return data.matches;
        });
}

YummlyClient.prototype.pullSingleListing = function(id) {
    return $.getJSON(
        this.complete_api_url + this.search + this.cuisine
        ).then(function(data) {
        return data.matches;
    });
}

YummlyClient.prototype.loadTemplate = function(name) {
    if (!this.templates) {
        this.templates = {};
    }

    var self = this;

    if (this.templates[name]) {
        var promise = $.Deferred();
        promise.resolve(this.templates[name]);
        return promise;
    } else {
        return $.get('./templates/' + name + '.html').then(function(data) {
            self.templates[name] = data; // <-- cache it for any subsequent requests to this template
            return data;
        });
    }
}

YummlyClient.prototype.drawListings = function(templateString, data) {
    var grid = document.querySelector("#lefty");

    var bigHtmlString = data.map(function(listing) {
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