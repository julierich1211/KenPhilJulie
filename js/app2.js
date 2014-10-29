window.onload = app;  // does not matter if this is on top or bottom.

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
        _.templateSettings.interpolate = /{([\s\S]+?)}/g;   // template for lodash

        var detail = {
                api_key: "a9bb7355dceffb0ebf4c559001cad27f",
                app_id: "9effb035"
            }
            // start app?
        var client = new YummlyList(detail);  

    });

}

function YummlyList(detail) { //constructor function that tests if e give it a API key
    //if (!detail.api_key + detail.app_id) {
    if (!detail.api_key) {
        throw new Error("you so wrong!?!?");
    }
    this.yummly_url = "http://api.yummly.com/";
    this.version = detail.api_version || "v1/"; // handle api version... if not given, just use the default "v1"
    this.api_key = detail.api_key;
    this.app_id = detail.app_id;
    this.complete_api_url = this.yummly_url + this.version;

    // derp.
    this.setupRouting();       
}

YummlyList.prototype.pullAllActiveListings = function() {
    return $.getJSON(
            this.complete_api_url + "api/recipes?_app_id=" + this.app_id + "&_app_key=" + this.api_key + "&requirePictures=true"
        )
        .then(function(data) {
            console.log(data.matches)
            
            return data.matches;
        });
}

YummlyList.prototype.pullSingleListing = function(id) {
    return $.getJSON(this.complete_api_url + "api/recipe/" + id +"?_app_id=" + this.app_id + "&_app_key=" + this.api_key).then(function(data) {
console.log(data);        
return data;
    });
}

YummlyList.prototype.loadTemplate = function(name) {
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

YummlyList.prototype.drawListings = function(templateString, data) {
    var grid = document.querySelector("#div");

    var bigHtmlString = data.map(function(listing) {
        return _.template(templateString, listing);
    }).join('');

    grid.innerHTML = bigHtmlString;
}

YummlyList.prototype.drawSingleListing = function(template, data) {
    var listing = data;

    var grid = document.querySelector("#yum");

    var bigHtmlString = _.template(template, listing);

    grid.innerHTML = bigHtmlString;
}

YummlyList.prototype.setupRouting = function() {
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