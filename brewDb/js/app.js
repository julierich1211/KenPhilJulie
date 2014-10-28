window.onload = app

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



    function BeerClient(options) {
        if (!options.api_key) {
            throw new Error("Y U NO APIKEY!?!?");

            this.bdb_url = "http://api.brewerydb.com/";
            this.version = options.api_version || "v2/"; // handle api version... if not given, just use the default "v2"
            this.api_key = options.api_key;
            this.complete_api_url = this.bdb_url + this.version;
            
            this.init();

        }

        BeerClient.prototype.pullAllActiveListings = function() {

            return $.getJSON(

                    this.complete_api_url + "search/style" + "?key=" + this.api_key + "&q=ipa"
                )
                .then(function(data) {
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


        BeerClient.prototype.init = function() {
            var self = this;
            // start doing shit...
            $.when(
                this.pullAllActiveListings(),
                this.loadTemplate('formBegin')
            ).then(function(formBegin, formBeginHtml) {
                self.pullAllActiveListings(formBeginHtml, formBegin)
            });

        };
    }
}
