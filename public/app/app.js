// /config/backbone/sync.js
(function(Backbone) {
  'use strict';

  var methods,
      _sync = Backbone.sync;

  Backbone.sync = function(method, entity, options) {
    _.defaults(options || {}, {
      beforeSend: _.bind(methods.beforeSend, entity),
      complete: _.bind(methods.complete, entity)
    });

    var sync = _sync(method, entity, options);
    if (!entity._fetch && method === 'read') {
      return sync;
    }
  };

  methods = {
    beforeSend: function() {
      return this.trigger('sync:start', this);
    },
    complete: function() {
      return this.trigger('sync:stop', this);
    }
  };

  return methods;
})(Backbone);

// app.js
this.App = function (JST, Backbone, Marionette) {
  'use strict';

  var App = new Marionette.Application({
    templates: JST
  });
  App.addRegions({
    statusRegion: '#status',
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
  App.reqres.setHandler('status:region', function () {
    return App.statusRegion;
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

// lib/utilities/spinner.js
this.App.module('Utilities', function (Utilities, App, Backbone, Marionette) {
  'use strict';

  App.commands.setHandler('status', function (entity) {
    entity.on('sync:start', function () {
      App.request('status:region').show(new Marionette.ItemView({
        template: 'utilities/status'
      }));
    });
    entity.on('sync:stop', function () {
      App.request('status:region').empty();
    });
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

// modules/welcome/welcome.js
this.App.module('Welcome', function (Welcome, App, Backbone, Marionette) {
  'use strict';

  // router
  Welcome.Router = Marionette.AppRouter.extend({
    appRoutes: {
      '': 'welcome'
    }
  });
  // initializer
  App.addInitializer(function () {
    new Welcome.Router({
      controller: new Welcome.Controller()
    });
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

// modules/welcome/controller.js
this.App.module('Welcome', function (Welcome, App, Backbone, Marionette) {
  'use strict';

  Welcome.Controller = Marionette.Controller.extend({
    initialize: function () {
      this.region = App.request('default:region');
    },
    welcome: function () {
      this.region.show(new Welcome.Views.Layout());
    }
  });
});

// modules/welcome/views.js
this.App.module('Welcome', function (Welcome, App, Backbone, Marionette) {
  'use strict';

  Welcome.Views = {};
  Welcome.Views.Layout = Marionette.LayoutView.extend({
    template: 'welcome'
  });
});

// modules/contents/controller.js
this.App.module('Contents', function (Contents, App, Backbone, Marionette) {
  'use strict';

  Contents.Controller = Marionette.Controller.extend({
    initialize: function () {
      this.collection = App.request('content:entities');
    },
    _show: function (item, ShowView) {
      var model = App.request('content:entity', item);
      model.on('sync', function () {
        App.request('default:region').show(new ShowView({ 
          model: model
        }));
      });

      App.execute('status', model);
      model.fetch({ cache: true });
    }
  });
});

// modules/contents/entities.js
this.App.module('Entities', function (Entities, App, Backbone) {
  'use strict';

  var _models = [];

  Entities.Content = Backbone.Model.extend({
    urlRoot: 'http://ae.filos.unam.mx/wp-json/posts',
    url: function () {
      return this.urlRoot + '/' + this.attributes.id + '?_jsonp=?';
    }
  });
  Entities.Contents = Backbone.Collection.extend({
    url: function () {
      var url = 'http://ae.filos.unam.mx/wp-json/posts',
          qs = '?type=content&page=' + this.page + '&_jsonp=?';

      return url + qs;
    },
    model: Entities.Content,
    initialize: function (options) {
      this.page = options.page || 1;
    },
    fetch: function (options) {
      _models = this.page > 1 ? _models : [];
      Backbone.Collection.prototype.fetch.call(this, options);
    },
    parse: function (models) {
      this._collection = App.request('content:entities', this.page + 1);

      if (models.length > 0) {
        _models.push(models);
        this._collection.fetch({ cache: true });
      } else {
        App.vent.trigger('when:fetchedAll', _.flatten(_models));
      }

      return models;
    }
  });
  App.reqres.setHandler('content:entity', function (item) {
    return new Entities.Content({ id: item });
  });
  App.reqres.setHandler('content:entities', function (page) {
    return new Entities.Contents({
      page: page
    });
  });
});

// modules/lemas/lemas.js
this.App.module('Lemas', function (Lemas, App, Backbone, Marionette) {
  'use strict';

  // router
  Lemas.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'lemas/azar': 'azar',
      'lemas/:id': 'show'
    }
  });
  // initializer
  App.addInitializer(function () {
    new Lemas.Router({
      controller: new Lemas.Controller()
    });
  });
});

// modules/lemas/controller.js
this.App.module('Lemas', function (Lemas, App, Backbone) {
  'use strict';

  Lemas.Controller = App.module('Contents').Controller.extend({
    azar: function () {
      App.vent.once('when:fetchedAll', function (models) {
        models = _.filter(models, function (model) {
          return model.terms.types[0].slug === 'lemas';
        });

        Backbone.history.navigate(
          '#/lemas/' + models[_.random(0, models.length - 1)].ID);
      });
      App.execute('status', this.collection);
      this.collection.fetch({ cache: true });
    },
    show: function (item) {
      this._show(item, Lemas.Views.Show);
    }
  });
});

// modules/lemas/views.js
this.App.module('Lemas', function (Lemas, App, Backbone, Marionette) {
  'use strict';

  Lemas.Views = {};
  Lemas.Views.Show = Marionette.ItemView.extend({
    template: 'lemas/item'
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

// modules/pages/controller.js
this.App.module('Pages', function (Pages, App) {
  'use strict';

  Pages.Controller = App.module('Contents').Controller.extend({
    show: function (item) {
      this._show(item, Pages.Views.Show);
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

