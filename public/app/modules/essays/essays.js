this.App.module('Essays', function (Essays, App, Backbone, Marionette) {

  // Initializer
  App.addInitializer(function () {
    // Set router instance
    new Essays.Router({
      // Set controller instance
      controller: new Essays.Controller()
    });
  });

});
