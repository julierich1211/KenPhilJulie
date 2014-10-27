window.onload = app;


function pullDetail(beerName) {
    this.beerName = beerName;
    //this.detail();
}
pullDetail.prototype.getInfo = function() {
    return $.get('https://api.openbeerdatabase.com/v1/beers.json' + this.beerName).then(function(data) {
        return data;
    });
};
pullDetail.prototype.getInfoBeer = function() {
    return $.get('https://api.openbeerdatabase.com/v1/beers.json' + this.beerName + '/openBeer').then(function(data) {
        return data;
    });
   
};

pullDetail.prototype.loadTemplate = function(templateName) {
    return $.get('templates/' + templateName + '.html').then(function(hstring) {
        return hstring;
    });
};
pullDetail.prototype.placeDetail = function(formmiddleHTML, formmiddle) {
    var d = new Date(beerName.created_at);
    beerName.joined = ["Joined On", d.toDateString()].join("");
    document.querySelector('').innerHTML = _.template(formmiddleHTML, formmiddle);
};
pullDetail.prototype.placeBeerData = function(formbeginHTML, formBegin) {
    document.querySelector('#formOne').innerHTML = formbegin.map(function(formBegin){
        return _.template(formBeginHTML, formBegin);
    }).join('');
};

pullDetail.prototype.setupRouting = function(){
    var self = this;

    Path.map("#/").to(function() {
        self.placeDetail(self.formBiginHtml, self.latestData);
    });

    Path.map("#/message/:anymessage").to(function(){
        alert(this.params.anymessage);
    })

    Path.map("#/listing/:id").to(function() {
        self.placeBeerData(this.params.id);
    });

    // set the default hash
    Path.root("#/");
}

pullDetail.prototype.detail = function() {
    var own = this;
    this.setupRouting();

    $.when(
        this.getInfo(),
        this.getInfoBeer(),
        //this.loadTemplate('formmiddle')
        this.loadTemplate('formBegin')
        //this.loadTemplate('openBeer')
    ).then(function(formBeginHTML, formBegin) {
        own.placeDetail(formBeginHTML, formBegin);
        //own.placeRepoData(openBeerHTML, openBeer);

    });
}


function app() {
    var subject = new pullDetail('beerName');
}
