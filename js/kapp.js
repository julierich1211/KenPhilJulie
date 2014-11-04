
 window.onload = app;

 // runs when the DOM is loaded

 // Global variables
 ident = [];
 styles = [];

 function counter() {
     // debugger;
     var getMeNumber = localStorage.getItem("visits");
     if (getMeNumber == null || isNaN(getMeNumber)) {
         getMeNumber = 0;
     } else {
         getMeNumber = parseInt(getMeNumber);
     }
     getMeNumber++;
     localStorage.setItem("visits", getMeNumber.toString())
     document.querySelector("#visited").innerHTML = localStorage.getItem("visits");
 }

 counter();


 function app() {

         // load some scripts (uses promises :D)
         loader.load({

             url: "./bower_components/jquery/dist/jquery.min.js"
         }, {
             url: "./bower_components/lodash/dist/lodash.min.js"
         }, {
             url: "./bower_components/pathjs/path.min.js"
         }, {
             url: "./bower_components/bower_components/foundation/js/foundation.js"
         }).then(function() {
             _.templateSettings.interpolate = /{([\s\S]+?)}/g;

             var options = {
                 app_key: "b5ba65d32dc965e46b6a000b8c532a56",
                 app_id: "db9d8943"
             };
             // start app?
             var client = new YummlyClient(options);
         });

     }
     // http://api.yummly.com/v1/api/recipes?_app_id=app-id
     // &_app_key=app-key&your _search_parameters
 function YummlyClient(options) {
     "use strict";
     if (!options.app_key) {
         throw new Error("Wrong APP_KEY?!?!?");
     }
     if (!options.app_id) {
         throw new Error("Wrong APP_ID?!?!?");
     }
     this.yummly_url = "http://api.yummly.com/v1/api/recipes?_app_id=";
     this.ingredient = "&allowedIngredient[]=";
     this.cuisine = "&allowedCuisine[]=cuisine^cuisine-";
     this.course = "&allowedCourse[]=course^course-";
     //this.pictures = "&requirePictures=true";
     this.app_id = options.app_id;
     this.app_key = options.app_key;
     this.complete_api_url = this.yummly_url + this.app_id + "&_app_key=" + this.app_key;


     console.log(this.complete_api_url);
     console.log("set up routing works");
     this.setupRouting();


 }

 // from Shawn/Adam attempting to undertsand the 
 // use & creation of an input object for forms
 YummlyClient.prototype.createInputObject = function() {
     "use strict";
     var input = {};
     $(':input').each(function() {
         input[this.name] = this.value;
     });
     console.dir(input);
     return input;



 };

 YummlyClient.prototype.takeRecipes = function() {

     var input = this.createInputObject();

     return $.getJSON(
         this.complete_api_url + this.course + this.course + input.course + this.course + this.cuisine + input.cuisine
     ).then(function(data) {
         console.log(data);
         console.log("takeRecipes Working");
         return data.matches;

     });
 };


 YummlyClient.prototype.loadTemplate = function(template) {
     return $.get('./templates/' + template + '.html').then(function(htmlString) {
         return htmlString;
     });
 };
 YummlyClient.prototype.placeRecipe = function(data, html) {
     "use strict";
     // debugger;
     console.log(data);
     console.log(html);
     document.querySelector('#recipeResults').innerHTML =
         data.map(function(element, index) {
             ident.push(element.id);
              return _.template(html, $.extend({}, element));
        }).join("");
 };



 YummlyClient.prototype.setupRouting = function() {
     "use strict";
     var self = this;


     Path.map("#/results").to(function() {
         $.when(
             self.takeRecipes(),
             self.loadTemplate('recipeResults')
         ).then(function(data, recipeResultsHtml) {
               console.log(data)
             self.placeRecipe(data, recipeResultsHtml);
             // self.giveRecipes(data, recipeResultsHtml);
             console.log(ident);

         });
     });

     $("#refresh").click(function() {
         $.when(
             self.takeRecipes(),
             self.loadTemplate('recipeResults')
         ).then(function(data, recipeResultsHtml) {
             self.placeRecipe(data, recipeResultsHtml);
             console.log(ident);

         });
     });


     // set the default hash to draw all listings
     Path.root("#/");
     Path.listen();
 };
