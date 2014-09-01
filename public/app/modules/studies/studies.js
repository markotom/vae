this.App.module('Studies', function (Studies, App) {
	'use strict';

  // Initializer
  App.addInitializer(function () {
    // Set router instance
    new Studies.Router({
      // Set controller instance
      controller: new Studies.Controller()
    });
  });

});
