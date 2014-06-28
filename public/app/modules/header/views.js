this.App.module('Header', function (Header, App, Backbone, Marionette) {
  'use strict';

  Header.Views = {};
  Header.Views.Main = Marionette.LayoutView.extend({
    template: 'header',
    regions: {
      search: '#search'
    },
    initialize: function () {
      this.collection = App.request('content:entities');
      this.collection.fetch({ cache: true });
    },
    onShow: function () {
      var search = this.search;
      this.collection.on('sync', function (collection, models) {
        search.show(new Header.Views.Search({
          models: models
        }));
      });
    }
  });
  Header.Views.Search = Marionette.ItemView.extend({
    template: 'search',
    serializeData: function () {
      return this.options;
    }
  });
});
