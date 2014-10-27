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
        };
        // start app?
        var client = new BeerClient(options);
    });

}

function BeerClient(options) {
    if (!options.api_key) {
        throw new Error("Yo dawg, I heard you like APIs. Y U NO APIKEY!?!?");
    } else { return
    this.bdb_url = "http://api.brewerydb.com/v2";
    this.api_key = options.api_key;
    this.complete_api_url = this.bdb_url;

    // derp.
    this.init();}
}

BeerClient.prototype.pullAllActiveListings = function() {
    return $.getJSON(

       this.complete_api_url + "search/style" + "?key=" + this.api_key + "&q=ipa";
    )
        .then(function(data) {
            console.log(data);
            return data;
        });
};

BeerClient.prototype.pullSingleListing = function(id) {
    return $.getJSON(this.complete_api_url + "search/style" + "?key=" + this.api_key + "&q=ipa").then(function(data) {
        return data;
    });
};

BeerClient.prototype.loadTemplate = function(name) {
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
};

BeerClient.prototype.drawListings = function(templateString, data) {
    var grid = document.querySelector("#formOne");

    var bigHtmlString = data.results.map(function(formBegin) {
        return _.template(templateString, formBegin);
    }).join('');

    grid.innerHTML = bigHtmlString;
};

BeerClient.prototype.drawSingleListing = function(template, data) {
    var listing = data.results[0];
    var grid = document.querySelector("#formOne");
    var bigHtmlString = _.template(template, formBegin);

    grid.innerHTML = bigHtmlString;
};

BeerClient.prototype.setupRouting = function(){
    var self = this;

    Path.map("#/").to(function() {
        self.drawStyle(self.formBiginHtml, self.latestData);
    });

    Path.map("#/message/:anymessage").to(function(){
        alert(this.params.anymessage);
    });

    Path.map("#/categoryID/:id").to(function() {
        self.drawSingleCategoryID(this.params.id);
    });

    // set the default hash
    Path.root("#/");
};

BeerClient.prototype.init = function() {
    var self = this;
    // start doing shit...
    $.when(
        this.pullAllActiveListings(),
        this.pullSingleListing(),
        this.loadTemplate('formBegin')
    ).then(function(formBegin, formBeginHtml) {
        self.pullAllActiveListings(formBeginHtml, formBegin);
    });
};