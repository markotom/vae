this.App.module('Essays', function (Essays, App) {
	'use strict';

  // Initializer
  App.addInitializer(function () {
    // Set router instance
    new Essays.Router({
      // Set controller instance
      controller: new Essays.Controller()
    });
  });

});
