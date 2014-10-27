window.onload = app;

// runs when the DOM is loaded
function app() {
    "use strict";

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
        var beer = new BeerMe(options);
    });
}

function beerMe(options) {
    "use strict";
    if (!options.api_key) {
        throw new Error("Yo dawg, I heard you like APIs. Y U NO APIKEY?!?!?!");
    }
    this.brewerydb_url = "http: //api.brewerydb.com/";
    this.version = "v2/";
    this.api_key = options.api_key;
    this.complete_api_url = this.brewerydb_url + this.version;

    this.init();

    console.log(new BeerMe);
}

beerMe.prototype.pullAllStyles = function() {
    "use strict";
    return $.getJSON(
            this.complete_api_url + "styles/?key=" + this.api_key + "&callback=?")
        .then(function(data) {
            return data;

        });

};
beerMe.prototype.pullSingleCategoryID = function(id) {
    return $.getJSON(this.complete_api_url + "styles/" + id + ".js?api_key=" + this.api_key + "&callback=?").then(function(data) {
        return data;
    });

};
beerMe.prototype.loadTemplate = function(name) {
    if (!this.templates) {
        this.templates = {};
    }
    var self = this;
    if (this.templates[name]) {
        var promise = $.Deferred();
        promise.resolve(this.templates[name]);
        return promise;
    } else {
        return$.get('./templates/' + name + '.html').then(function(data) {
            self.templates[name] = data;
            return data;


        });
    }
};
beerMe.prototype.drawStyle = function(templateString, data) {
    var grid = document.querySelector("#styles");
    var bigHTMLString = data.results.map(function(style) {
        return_.template(templateString, style);
    }).join('');
    grid.innerHTML = bigHTMLString;
};
beerMe.prototype.drawSingleCategoryID = function(template, data) {
    var style = data.results[0];
    var grid = document.querySelector("#styles");
    var bigHTMLString = _.template(template, style);

    grid.innerHTML = bigHTMLString;
};

beerMe.prototype.init = function() {
    "use strict";
    var self = this;

    Path.map("#/").to(function() {
        $.when(
            self.loadTemplate("style"),
            self.pullAllStyles()
        ).then(function() {
            self.drawStyle(arguments[0], arguments[1]);
            console.dir(self);
        });
    });
    Path.map("#/message/:anymessage").to(function() {
        alert(this.params.anymessage);

    });
    Path.map("#/style/:id").to(function() {
        $.when(
            self.loadTemplate("drawSingleCategoryID"),
            self.pullSingleCategoryID(this.params.id)
        ).then(function() {
            self.drawSingleCategoryID(arguments[0], arguments[1]);
        });
    });
    Path.root("#/");
    Path.listen();
};