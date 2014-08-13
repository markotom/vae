this.App.module('Studies', function (Studies, App, Backbone, Marionette) {

  // Router
  Studies.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'studies/random': 'showRandomPost',
      'studies/:id': 'showPost'
    }
  });

  // Controller
  Studies.Controller = App.Controllers.Post.extend({
    initialize: function () {
      this.prefix = 'studies';
      this.entity = 'study:entity';
      this.entities = 'studies:entities';
    },
    showPost: function (item) {
      this._showPost(item, Studies.Views.Show);
    },
    showRandomPost: function () {
      this._showRandomPost();
    }
  });

});
