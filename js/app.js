window.onload = app;
// runs when the DOM is loaded
function app() {
    // "use strict";

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

function BeerMe(options) {
    //"use strict";
    if (!options.api_key) {
        throw new Error("Yo dawg, I heard you like APIs. Y U NO APIKEY?!?!?!");
        //http://api.brewerydb.com/v2/search?key=[MyKey]&type=brewery&q={the brewery you are searching for}
        this.brewerydb_url = "api.brewerydb.com/";
        this.version = "v2/";
        this.api_key = options.api_key;
        this.complete_api_url = this.brewerydb_url + this.version;

        this.init();
    }

}
BeerMe.prototype.pullAllStyles = function() {
    // "use strict";
    return $.getJSON(
            this.complete_api_url + "search?key=" + this.api_key + "&callback=?")
        .then(function(data) {
            return data;

        });
    console.log(data);
};
BeerMe.prototype.pullSingleCategoryID = function(id) {
    return $.getJSON(this.complete_api_url + "search?key=" + id + this.api_key + "&callback=?").then(function(data) {
        return data;
    });
    console.log(data);
};
BeerMe.prototype.loadTemplate = function(name) {
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
            self.templates[name] = data;
            return data;


        });
    }
};
BeerMe.prototype.drawStyle = function(templateString, data) {
    var grid = document.querySelector("#formOne");
    var bigHTMLString = data.results.map(function(style) {
        return_.template(templateString, style);
    }).join('');
    grid.innerHTML = bigHTMLString;
};
BeerMe.prototype.drawSingleCategoryID = function(id) {
    var categoryID = this.latestData.results.filter(function(categoryID) {
        return categoryID.categoryID === parseInt(id);
    });
    var grid = document.querySelector("#formOne");
    var bigHTMLString = _.template(this.formBeginHtml, categoryID[0]);
    grid.innerHTML = bigHTMLString;
};

BeerMe.prototype.setupRouting = function() {
    var self = this;

    Path.map("#/").to(function() {
        self.drawStyle(self.formBiginHtml, self.latestData);
    });

    Path.map("#/message/:anymessage").to(function() {
        alert(this.params.anymessage);
    });

    Path.map("#/categoryID/:id").to(function() {
        self.drawSingleCategoryID(this.params.id);
    });

    // set the default hash
    Path.root("#/");
};

BeerMe.prototype.init = function() {
    "use strict";
    var self = this;
    this.setupRouting();

    $.when(
        this.pullAllStyles(),
        this.loadTemplate("formBegin"),
        self.loadTemplate()
    ).then(function(data, html, formBeginHtml) {
        self.latestData = data;
        self.formBeginHtml = html;

        Path.listen();
    });
    console.dir(init);
};
