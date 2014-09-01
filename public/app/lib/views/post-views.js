this.App.module('Views', function (Views, App, Backbone, Marionette, $) {
  'use strict';

  Views.Post = {};

  // Post Show View
  Views.Post.Show = Marionette.LayoutView.extend({
    template: 'posts/item',
    regions: {
      cloud: '#cloud'
    },
    onShow: function () {
      this.cloud.show(new Views.Post.Cloud({
        model: this.model
      }));

      $('body').animate({
	      scrollTop: $('body').offset().top
	    }, 500);
    }
  });

  // Posts Cloud View
  Views.Post.Cloud = Marionette.ItemView.extend({
    template: 'posts/cloud',
    onShow: function () {
      App.execute('cloud', {
        words: this.model.get('words')
      });
    }
  });

});
