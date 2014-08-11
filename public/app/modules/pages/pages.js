this.App.module('Pages', function (Pages, App, Backbone, Marionette) {

  // Initializer
  App.addInitializer(function () {
    // Set router instance
    new Pages.Router({
      // Set controller instance
      controller: new Pages.Controller()
    });
  });

});
