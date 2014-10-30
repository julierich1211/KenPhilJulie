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
        throw new Error("Y U NO APIKEY?!?!?");
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

YummlyClient.prototype.getSingleRecipe = function() {
    return $.getJSON(this.complete_api_url + "&q=imageUrlsBySize").then(function(data) {
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
YummlyClient.prototype.showAllRecipes = function(data, html) {
    
    document.querySelector("#lefty").innerHTML = 
    data.map(function(x) {

    return    _.template(html, x);
    }).join('');
}

YummlyClient.prototype.showSingleRecipe = function(data, html) {
    console.log(data);
    document.querySelector("#righty").innerHTML = 
    data.map(function(y){
        return _.template(html, y);
    }).join('');
    
}

YummlyClient.prototype.init = function() {
    var self = this;

    $.when(
        this.getAllRecipes(),
        //this.getSingleRecipe(),
        this.loadTemplate('left'),
        this.loadTemplate('right')
    ).then(function(x, y) {
        self.showAllRecipes(x, y);
        self.showSingleRecipe(x, y)
    });

}
/*
YummlyClient.prototype.drawListings = function(templateString, data) {
    var grid = document.querySelector("#listings");

    var bigHtmlString = data.results.map(function(listing) {
        return _.template(templateString, listing);
    }).join('');

    grid.innerHTML = bigHtmlString;
}

YummlyClient.prototype.drawSingleListing = function(template, data) {
    var listing = data.results[0];
    var grid = document.querySelector("#listings");
    var bigHtmlString = _.template(template, listing);

    grid.innerHTML = bigHtmlString;
}

YummlyClient.prototype.setupRouting = function() {
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
}*/