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
            api_key: "aavnvygu0h5r52qes74x9zvo"
        }
        // start app?
        var client = new EtsyClient(options);
    })

}

function YummlyClient(options) {
    if (!options.api_key) {
        throw new Error("Yo dawg, I heard you like APIs. Y U NO APIKEY!?!?");
    }
    this.etsy_url = "http://api.yummly.com/";
    this.version = options.api_version || "v2/"; // handle api version... if not given, just use the default "v2"
    this.api_key = options.api_key;
    this.complete_api_url = this.etsy_url + this.version;

    // derp.
    this.setupRouting();
}

EtsyClient.prototype.pullAllActiveListings = function() {
    return $.getJSON(
        this.complete_api_url + "listings/active.js?api_key=" + this.api_key + "&includes=Images&callback=?"
    )
        .then(function(data) {
            return data;
        });
}

EtsyClient.prototype.pullSingleListing = function(id) {
    return $.getJSON(this.complete_api_url + "listings/"+id+".js?api_key=" + this.api_key + "&includes=Images&callback=?").then(function(data) {
        return data;
    });
}

EtsyClient.prototype.loadTemplate = function(name) {
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

EtsyClient.prototype.drawListings = function(templateString, data) {
    var grid = document.querySelector("#listings");

    var bigHtmlString = data.results.map(function(listing) {
        return _.template(templateString, listing);
    }).join('');

    grid.innerHTML = bigHtmlString;
}

EtsyClient.prototype.drawSingleListing = function(template, data) {
    var listing = data.results[0];
    var grid = document.querySelector("#listings");
    var bigHtmlString = _.template(template, listing);

    grid.innerHTML = bigHtmlString;
}

EtsyClient.prototype.setupRouting = function() {
    var self = this;

    Path.map("#/").to(function() {
        $.when(
            self.loadTemplate("listing"),
            self.pullAllActiveListings()
        ).then(function() {
            self.drawListings(arguments[0], arguments[1]);

            console.dir(self)
        })
    });

    Path.map("#/message/:anymessage").to(function() {
        alert(this.params.anymessage);
    })

    Path.map("#/listing/:id").to(function() {
        $.when(
            self.loadTemplate("single-page-listing"),
            self.pullSingleListing(this.params.id)
        ).then(function() {
            self.drawSingleListing(arguments[0], arguments[1]);
        })
    });

    // set the default hash to draw all listings
    Path.root("#/");
    Path.listen();
}