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
