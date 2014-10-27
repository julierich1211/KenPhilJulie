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
pullDetail.prototype.placeDetail = function(formmiddleHTML, formmiddle) {
    var d = new Date(beerName.created_at);
    beerName.joined = ["Joined On", d.toDateString()].join("");
    document.querySelector('').innerHTML = _.template(formmiddleHTML, formmiddle);
};
pullDetail.prototype.placeBeerData = function(formbeginHTML, formBegin) {
    document.querySelector('#formOne').innerHTML = formbegin.map(function(formbegin){
        return _.template(formbeginHTML, formBegin);
    }).join('');
};
pullDetail.prototype.detail = function() {
    var own = this;

    $.when(
        this.getInfo(),
        this.getInfoBeer(),
        //this.loadTemplate('formmiddle')
        this.loadTemplate('formBegin')
    ).then(function(formmiddle, formmiddleHTML) {
        own.placeDetail(formmiddleHTML, formmiddle);
        own.placeBeerData(formbeginHTML, formBegin);
    });
}
window.onload = app;

function app() {
    var subject = new pullDetail('beerName');
}
