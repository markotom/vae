this.App.module('Controllers', function (Controllers, App, Backbone) {
  'use strict';

  Controllers.Post = Controllers.Application.extend({
    _showPost: function (item, PostView) {
      // Get model
      var model = App.request(this.entity, { id: item });

      // Show view when sync is done
      model.on('sync', function () {
        this.show(new PostView({ model: model }));
      }, this);

      // Show loading message
      App.execute('loading', model);

      // Fetch model
      model.fetch();
    },
    _showRandomPost: function () {
      var collection = App.request(this.entities);

      // Show view when sync is done
      collection.once('sync', function (collection, models) {
        var model = models[Math.floor(Math.random() * models.length)];
        Backbone.history.navigate('#/'+ this.prefix +'/' + model.ID);
      }, this);

      // Show loading message
      App.execute('loading', collection);

      collection.fetch();
    }
  });
});
