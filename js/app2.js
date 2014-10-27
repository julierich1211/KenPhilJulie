//_.templateSettings.interpolate = /{([\s\S]+?)}/g;

function pullDetail(beerName) {
    this.beerName = beerName;
    this.detail();
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
    console.log(data);
};
pullDetail.prototype.loadTemplate = function(templateName) {
    return $.get('templates/' + templateName + '.html').then(function(hstring) {
        return hstring;
    });
};
pullDetail.prototype.placeDetail = function(beerHTML, beer) {
    var d = new Date(beerName.created_at);
    beerName.joined = ["Joined On", d.toDateString()].join("");
    document.querySelector('').innerHTML = _.template(beerHTML, beer);
};
pullDetail.prototype.placeBeerData = function(openBeerHTML, openBeer) {
    document.querySelector('#formOne').innerHTML = openBeer.map(function(openBeer){
        return _.template(openBeerHTML, openBeer);
    }).join('');
};
pullDetail.prototype.detail = function() {
    var own = this;

    $.when(
        this.getInfo(),
        this.getInfoBeer(),
        this.loadTemplate('formBegin')
        //this.loadTemplate('openBeer')
    ).then(function(formBegin, formBeginHTML) {
        own.placeDetail(formBeginHTML, formBegin);
        //own.placeRepoData(openBeerHTML, openBeer);
    });
}
window.onload = app;

function app() {
    var subject = new pullDetail('beerName');
}
