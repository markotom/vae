this.App.module('Lemmas', function (Lemmas, App, Backbone, Marionette) {

  // Initializer
  App.addInitializer(function () {
    // Set router instance
    new Lemmas.Router({
      // Set controller instance
      controller: new Lemmas.Controller()
    });
  });

});
