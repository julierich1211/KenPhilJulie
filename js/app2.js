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
    return $.get('https://api.openbeerdatabase.com/v1/beers.json' + this.username + '/openBeer').then(function(data) {
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
    var d = new Date(profile.created_at);
    profile.joined = ["Joined On", d.toDateString()].join("");
    document.querySelector('.left-column').innerHTML = _.template(beerHTML, beer);
};
pullDetail.prototype.placeBeerData = function(openBeerHTML, openBeer) {
    document.querySelector('.right-column').innerHTML = openBeer.map(function(openBeer){
        return _.template(openBeerHTML, openBeer);
    }).join('');
};
pullDetail.prototype.detail = function() {
    var own = this;

    $.when(
        this.getInfo(),
        this.getInfoBeer(),
        this.loadTemplate('beer'),
        this.loadTemplate('openBeer')
    ).then(function(beer, openBeer, beerHTML, openBeerHTML) {
        own.placeDetail(beerHTML, beer);
        own.placeRepoData(openBeerHTML, openBeer);
    });
}
window.onload = app;

function app() {
    var subject = new pullDetail('beerName');
}
