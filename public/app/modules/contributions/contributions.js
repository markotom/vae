this.App.module('Contributions', function (Contributions, App) {
	'use strict';

  // Initializer
  App.addInitializer(function () {
    // Set router instance
    new Contributions.Router({
      // Set controller instance
      controller: new Contributions.Controller()
    });
  });

});
