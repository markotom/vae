this.App.module('Lemmas', function (Lemmas, App, Backbone, Marionette) {

  // Router
  Lemmas.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'lemmas/random': 'showRandomLemma',
      'lemmas/:id': 'showLemma'
    }
  });

  // Controller
  Lemmas.Controller = App.Controllers.Application.extend({
    initialize: function () {
      this.collection = App.request('lemmas:entities');
    },
    showLemma: function (item) {
      // Get model
      var model = App.request('lemma:entity', { id: item });

      // Show view when sync is done
      model.on('sync', function () {
        this.show(new Lemmas.Views.Show({ model: model }));
      }, this);

      // Show loading message
      App.execute('loading', model);

      // Fetch model
      model.fetch();
    },
    showRandomLemma: function () {
      // Show view when sync is done
      this.collection.once('sync', function (collection, models) {
        var model = models[Math.floor(Math.random() * models.length)];
        Backbone.history.navigate('#/lemmas/' + model.ID);
      }, this);

      // Show loading message
      App.execute('loading', this.collection);

      this.collection.fetch();
    }
  });

});
