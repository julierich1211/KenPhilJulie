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
            app_key: "537c65777266e877fd1e9e70f24ab7ac"
            app_id: "383b8866"
        }
        // start app?
        var client = new Client(options);
    })

}

function Client(options) {
    if (!options.api_key) {
        throw new Error("Y U NO APIKEY!?!?");
    }
    this.yum_url = "https://api.yummly.com/";
    this.version = options.api_version || "v1/"; // handle api version... if not given, just use the default "v2"
    this.app_key = options.app_key;
    this.app_id = options.app_id;
    this.complete_api_url = this.yum_url + this.version;

    // derp. _app_id=app-id&_app_key=app-key
    this.setupRouting();
}

EtsyClient.prototype.pullAllActiveListings = function() {
    return $.getJSON(
        this.complete_api_url + "listings/active.js?api_key=" + this.api_key + "&callback=?"
    )
        .then(function(data) {
            return data;
        });
}

EtsyClient.prototype.pullSingleListing = function(id) {
    return $.getJSON(this.complete_api_url + "listings/"+id+".js?api_key=" + this.api_key + "&callback=?").then(function(data) {
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