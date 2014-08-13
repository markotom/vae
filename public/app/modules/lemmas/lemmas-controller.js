this.App.module('Lemmas', function (Lemmas, App, Backbone, Marionette) {

  // Router
  Lemmas.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'lemmas/random': 'showRandomPost',
      'lemmas/:id': 'showPost'
    }
  });

  // Controller
  Lemmas.Controller = App.Controllers.Post.extend({
    initialize: function () {
      this.prefix = 'lemmas';
      this.entity = 'lemma:entity';
      this.entities = 'lemmas:entities';
    },
    showPost: function (item) {
      this._showPost(item, Lemmas.Views.Show);
    },
    showRandomPost: function () {
      this._showRandomPost();
    }
  });

});
