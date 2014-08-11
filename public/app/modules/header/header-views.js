this.App.module('Header', function (Header, App, Backbone, Marionette) {
  'use strict';

  // Header Views
  Header.Views = {};

  // Header Main View
  Header.Views.Main = Marionette.LayoutView.extend({
    template: 'header',
    regions: {
      search: '#search'
    },
    initialize: function () {
      this.collection = App.request('content:entities');

      this.listenTo(this.collection, 'sync', function (collection, models) {
        this.search.show(new Header.Views.Search({
          models: models
        }));
      });

      this.collection.fetch();
    }
  });

  // Header Search View
  Header.Views.Search = Marionette.ItemView.extend({
    template: 'search',
    serializeData: function () {
      return this.options;
    }
  });
});
