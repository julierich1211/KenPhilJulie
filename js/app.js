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

            // start app?
        })
var flickr = new Flickr({
  api_key: "1234ABCD1234ABCD1234ABCD1234ABCD"
});
    } 
//upload to flickr
   //Flickr.authenticate(FlickrOptions, function(error, flickr) {
  //var uploadOptions = {
    //photos: [{
      //title: "test",
      //tags: ["happy","fox"],
     // photo: __dirname + "/test.jpg"
   // },{
     // title: "test2",
      //tags: ["secondary", "test", "image"],
      //photo: __dirname + "/test.jpg"
   // }]
 // };

  //Flickr.upload(uploadOptions, FlickrOptions, function(err, result) {
    //if(err) {
      //return console.error(error);
    //}
    //console.log("photos uploaded", result);
 // });
//});
