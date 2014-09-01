this.App.module('Welcome', function (Welcome) {
  'use strict';

  // Initialize module
  Welcome.addInitializer(function () {
    // Set router instance
    new Welcome.Router({
      // Set controller instance
      controller: new Welcome.Controller()
    });
  });
});
