_.templateSettings.interpolate = /{([\s\S]+?)}/g;

function RepoMan(githubUsername) {
    this.username = githubUsername;

    this.init();
}

RepoMan.prototype.getUserInfo = function() {
    return $.get('https://api.github.com/users/' + this.username).then(function(data) {
        return data;
    });
};

RepoMan.prototype.getRepoInfo = function() {
    return $.get('https://api.github.com/users/' + this.username + '/repos').then(function(data) {
        return data;
    });
};

RepoMan.prototype.loadTemplateFile = function(templateName) {
    return $.get('./templates/' + templateName + '.html').then(function(htmlstring) {
        return htmlstring;
    });
};

RepoMan.prototype.putProfileDataOnPage = function(profileHtml, profile) {
    var d = new Date(profile.created_at);
    profile.joined = ["Joined on ", d.toDateString()].join("");
    document.querySelector('.flex-item-left').innerHTML = _.template(profileHtml, profile);
    $('#envelope').iconify({
    color: "#3e3e3e", // default: "red"
    hoverColor: "#448cd5", // default: "blue"
    size: "15", // default: "28"
    animate: true, // default: true
    animateMultiplier: 1.2 // default: 1.5
});
    $('#tumblr-square').iconify({
    color: "#3e3e3e", // default: "red"
    hoverColor: "#448cd5", // default: "blue"
    size: "15", // default: "28"
    animate: true, // default: true
    animateMultiplier: 1.2 // default: 1.5
});
};

RepoMan.prototype.putRepoDataOnPage = function(repoHtml, repos) {
    console.log(repos)
    document.querySelector('.flex-item-right').innerHTML =
        repos.sort(function(a, b) {
            var firstDate = new Date(a.updated_at),
                secondDate = new Date(b.updated_at);
            return +firstDate > +secondDate ? -1 : 1;
        }).map(function(obj) {
            var d = new Date(obj.updated_at);
            obj.updated = ["Updated on ", d.toDateString()].join("");
            return _.template(repoHtml, obj);
        }).join("")
};

RepoMan.prototype.init = function() {
    var self = this;
    // start doing shit...
    $.when(
        this.getUserInfo(),
        this.getRepoInfo(),
        this.loadTemplateFile('profile'),
        this.loadTemplateFile('repo')
    ).then(function(profile, repos, profileHtml, repoHtml) {
        self.putProfileDataOnPage(profileHtml, profile)
        self.putRepoDataOnPage(repoHtml, repos)
    })
};

window.onload = app;

function app() {
    var myRepo = new RepoMan('therinken');
}

***************************************************


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
            api_key: "_app_id=9effb035&_app_key=a9bb7355dceffb0ebf4c559001cad27f"
        }
        // start app?
        var client = new YummlyClient(options);
    })

}

function YummlyClient(options) {
    if (!options.app_key) {
        throw new Error("Yo dawg, I heard you like APIs. Y U NO APIKEY?!?!?");
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

YummlyClient.prototype.pullSingleRecipe = function(id) {
    return $.getJSON(this.complete_api_url).then(function(data) {
        return data;
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

YummlyClient.prototype.drawRecipe = function(templateString, data) {
    var grid = document.querySelector("#lefty");

    var bigHtmlString = data.results.map(function(listing) {
        return _.template(templateString, listing);
    }).join('');

    grid.innerHTML = bigHtmlString;
}

YummlyClient.prototype.drawSingleRecipe = function(template, data) {
    var listing = data.results[0];
    var grid = document.querySelector("#lefty");
    var bigHtmlString = _.template(template, listing);

    grid.innerHTML = bigHtmlString;
}
YummlyClient.prototype.init = function() {
    var self = this;
    // start doing shit...
    $.when(
        this.getAllRecipes(),
       
        this.loadTemplate('left')
        
    ).then(function(left, leftHtml) {
        self.showAllRecipes(profileHtml, profile)
        self.putRepoDataOnPage(repoHtml, repos)
    })
};

/*
EtsyClient.prototype.setupRouting = function() {
    var self = this;

    Path.map("#/").to(function() {
        $.when(
            self.loadTemplate("lefty"),
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
*/