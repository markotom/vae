this.App.module('Contributions', function (Contributions, App) {
  'use strict';

  // Contributions Views
  Contributions.Views = {};

  // Contributions Show View
  Contributions.Views.Show = App.Views.Post.Show.extend();

});
