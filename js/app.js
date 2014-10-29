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
        throw new Error("Sorry, you SUCK!!!");
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
YummlyClient.prototype.showAllRecipes = function(leftHtml, left) {
    var grid = document.querySelector("#lefty").innerHTML = _.template(leftHtml, left);;

    // body...
};

YummlyClient.prototype.init = function() {
    var self = this;

    $.when(
        this.getAllRecipes(),
        this.loadTemplate('left')
        ).then(function(){
        self.showAllRecipes(arguments[0], arguments[1]);
        })
    
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
    var grid = document.querySelector("#div");

    var bigHtmlString = data.map(function(listing) {
        return _.template(templateString, listing);
    }).join('');

    grid.innerHTML = bigHtmlString;
}

YummlyClient.prototype.drawSingleListing = function(template, data) {
    var listing = data;

    var grid = document.querySelector("#yum");

    var bigHtmlString = _.template(template, listing);

    grid.innerHTML = bigHtmlString;
}

YummlyClient.prototype.setupRouting = function() {
    var self = this;

    Path.map("#/").to(function() { 
        $.when(
            self.loadTemplate("yum"),
            self.pullAllActiveListings()
        ).then(function() {
            self.drawListings(arguments[0], arguments[1]);

            console.dir(self)
        })
    });  

    Path.map("#/message/:anymessage").to(function() {
        alert(this.params.anymessage);
    })

   // Path.map("#/listing/:id").to(function() {  //
  //      self.drawSingleListing(this.params.id);
  //  });
Path.map("#/recipe/:id").to(function() {
        $.when(
            self.loadTemplate("yumsingle"),
            self.pullSingleListing(this.params.id)
        ).then(function() {
            self.drawSingleListing(arguments[0], arguments[1]);
        })
    });
    // set the default hash
    Path.root("#/");  //if there is no hash on url, it will set the default route to be #/


        Path.listen();
   // })
}