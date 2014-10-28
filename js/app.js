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

<<<<<<< HEAD
=======
function BeerClient(options) {
    if (!options.api_key) {
        throw new Error("Yo dawg, I heard you like APIs. Y U NO APIKEY!?!?");

    } else {
>>>>>>> 022d65cb12fd2fe48888f5dedd295b879f43a3b0



<<<<<<< HEAD
function BeerClient(options) {
    var brewerydb = $.getJSON("./js/brewerydb.json", function() {
            console.log("success");
        })
        .done(function() {
            console.log("second success");
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
=======
        // derp.
        this.init();
    }

>>>>>>> 022d65cb12fd2fe48888f5dedd295b879f43a3b0
}

function pullAllActiveListings(callback) {
    $.getJSON("./js/brewerydb.json",
        function(data) {
            var allBeer = [];
            $.each(data.items,
                function(item) {
                    allBeer.push(item);
                });
            callback(allBeer);
            // callback(data.items); should also work
        });
}

BeerClient.prototype.pullAllActiveListings = function() {
    return $.getJSON('brewerydb.json').then(function(data) {
        console.log(data);
        return data;
    });
};

BeerClient.prototype.pullSingleListing = function(id) {
    return $.getJSON('brewerydb.json').then(function(data) {
        console.log(data);
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

<<<<<<< HEAD
    // BeerClient.prototype.init = function() {
    //   var self = this;
=======
/*
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
*/

BeerClient.prototype.init = function() {
    var self = this;
>>>>>>> 022d65cb12fd2fe48888f5dedd295b879f43a3b0
    // start doing shit...
    // $.when(
    //   this.pullAllActiveListings(),
    // this.pullSingleListing(),
    // this.loadTemplate('formBegin')
    //).then(function(formBegin, formBeginHtml) {
    //  self.pullAllActiveListings(formBeginHtml, formBegin);
    //});
};
