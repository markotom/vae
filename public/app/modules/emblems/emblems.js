this.App.module('Emblems', function (Emblems, App) {
	'use strict';

  // Initializer
  App.addInitializer(function () {
    // Set router instance
    new Emblems.Router({
      // Set controller instance
      controller: new Emblems.Controller()
    });
  });

});
