// app.js
this.App = function (JST, Backbone, Marionette) {
  'use strict';

  var App = new Marionette.Application({
    templates: JST
  });
  App.addRegions({
    headerRegion: '#header',
    contentRegion: '#content',
    footerRegion: '#footer'
  });
  App.on('start', function () {
    Backbone.history.start();
  });
  App.reqres.setHandler('default:region', function () {
    return App.contentRegion;
  });
  return App;
}(JST, Backbone, Marionette);

// lib/utilities/renderer.js
this.App.module('Utilities', function (Utilities, App, Backbone, Marionette, _) {
  'use strict';

  _.extend(Marionette.Renderer, {
    render: function (template, data) {
      if (!App.templates[template]) {
        throw 'Template "' + template + '" not found!';
      }
      return App.templates[template](data);
    }
  });
});

// lib/utilities/fetch.js
this.App.module('Utilities', function(Utilities, App, Backbone, Marionette, $, _) {
  'use strict';

  App.commands.setHandler('when:fetched', function (entities, callback) {
    var xhrs = _.chain([entities]).flatten().pluck('_fetch').value();
    $.when.apply($, xhrs).done(callback);
  });
});

// modules/header/header.js
this.App.module('Header', function (Header, App) {
  'use strict';

  Header.addInitializer(function () {
    new Header.Controller({
      region: App.headerRegion
    });
  });
});

// modules/header/controller.js
this.App.module('Header', function (Header, App, Backbone, Marionette) {
  'use strict';

  Header.Controller = Marionette.Controller.extend({
    initialize: function () {
      this.options.region.show(new Header.Views.Main());
    }
  });
});

// modules/header/views.js
this.App.module('Header', function (Header, App, Backbone, Marionette) {
  'use strict';

  Header.Views = {};
  Header.Views.Main = Marionette.LayoutView.extend({
    template: 'header'
  });
});

// modules/footer/footer.js
this.App.module('Footer', function (Footer, App) {
  'use strict';

  Footer.addInitializer(function () {
    new Footer.Controller({
      region: App.footerRegion
    });
  });
});

// modules/footer/controller.js
this.App.module('Footer', function (Footer, App, Backbone, Marionette) {
  'use strict';

  Footer.Controller = Marionette.Controller.extend({
    initialize: function () {
      this.options.region.show(new Footer.Views.Main());
    }
  });
});

// modules/footer/views.js
this.App.module('Footer', function (Footer, App, Backbone, Marionette) {
  'use strict';

  Footer.Views = {};
  Footer.Views.Main = Marionette.ItemView.extend({
    template: 'footer'
  });
});

// modules/pages/pages.js
this.App.module('Pages', function (Pages, App, Backbone, Marionette) {
  'use strict';

  // router
  Pages.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'pages/:id': 'show'
    }
  });
  // initializer
  App.addInitializer(function () {
    new Pages.Router({
      controller: new Pages.Controller()
    });
  });
});

// modules/pages/entities.js
this.App.module('Entities', function (Entities, App, Backbone) {
  'use strict';

  Entities.Page = Backbone.Model.extend({
    idAttribute: 'ID',
    urlRoot: 'http://ae.filos.unam.mx/wp-json/pages?_jsonp=?'
  });
  Entities.Pages = Backbone.Collection.extend({
    url: 'http://ae.filos.unam.mx/wp-json/pages?_jsonp=?',
    model: Entities.Page,
    initialize: function () {
      this.fetch({ dataType: 'jsonp' });
    }
  });
  App.reqres.setHandler('page:entity', function (id, collection) { // very ugly, should refactor
    return collection.get(id);
  });
  App.reqres.setHandler('page:entities', function () {
    return new Entities.Pages();
  });
});

// modules/pages/controller.js
this.App.module('Pages', function (Pages, App, Backbone, Marionette) {
  'use strict';

  Pages.Controller = Marionette.Controller.extend({
    initialize: function () {
      this.collection = App.request('page:entities');
    },
    show: function (page) { // very ugly, should refactor
      var self = this;
      App.execute('when:fetched', this.collection, function () {
        page = App.request('page:entity', page, self.collection);
        App.request('default:region').show(new Pages.Views.Show({
          model: page
        }));
      });
    }
  });
});

// modules/pages/views.js
this.App.module('Pages', function (Pages, App, Backbone, Marionette) {
  'use strict';

  Pages.Views = {};
  Pages.Views.Show = Marionette.ItemView.extend({
    template: 'pages/item'
  });
});
