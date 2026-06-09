import angular from 'angular';

import { Meteor } from 'meteor/meteor';

import { name as Afkar } from '../imports/ui/components/afkar/afkar';

function onReady() {
  angular.bootstrap(document, [
    Afkar
  ], {
    strictDi: true
  });
}

if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}

Template.body.events({

  'click #btnActivar'() {
    Meteor.call("activarSpool", (err, res) => {
      if (err) alert("Error: " + err);
      else alert(res);
    });
  }, 

  'click #btnDesactivar'() {
    Meteor.call("desactivarSpool", (err, res) => {
      if (err) alert("Error: " + err);
      else alert(res);
    });
  }
});