this.App.module('Welcome', function (Welcome, App, Backbone, Marionette, $, _) {
  'use strict';

  // Welcome Views
  Welcome.Views = {};

  // Welcome Main View
  Welcome.Views.Main = Marionette.LayoutView.extend({
    template: 'welcome',
    regions: {
      cloud: '#cloud'
    },
    initialize: function () {
      this.collection = App.request('content:entities');

      this.listenTo(this.collection, 'sync', function (collection, models) {
        this.cloud.show(new Welcome.Views.Cloud({
          models: models
        }));
      });

      this.collection.fetch();
    }
  });

  // Welcome Cloud View
  Welcome.Views.Cloud = Marionette.ItemView.extend({
    template: 'posts/cloud',
    onShow: function () {
      var words = _.chain(this.options.models)
        .flatten()
        .pluck('words')
        .flatten()
        .groupBy('text')
        .map(function(word, text) {
          return {
            text: text,
            size: _.reduce(word, function (w, w2) { return w + w2.size; }, 0)
          };
        })
        .sortBy(function (word) { return -word.size; })
        .value();

      App.execute('cloud', {
        words: words,
        size: [1000, 400]
      });
    }
  });
});
