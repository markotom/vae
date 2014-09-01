this.App.module('Essays', function (Essays, App) {
  'use strict';

  // Essays Views
  Essays.Views = {};

  // Essays Show View
  Essays.Views.Show = App.Views.Post.Show.extend();

});
