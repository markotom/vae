this.App.module('Pages', function (Pages, App, Backbone, Marionette) {
  'use strict';

  // Pages Views
  Pages.Views = {};

  // Pages Show View
  Pages.Views.Show = Marionette.ItemView.extend({
    template: 'pages/item'
  });

});
