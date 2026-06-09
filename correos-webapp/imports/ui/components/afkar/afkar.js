import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';

import template from './afkar.html';
import { name as Nav } from '../nav/nav';
import { name as Home } from '../home/home';
import { name as Maquina } from '../maquina/maquina';
import { name as Imprimir } from '../imprimir/imprimir';
import { name as Kiosko } from '../kiosko/kiosko';


class Afkar {}

const name = 'afkar';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  ngMaterial,
  Nav,
  Home,
  Maquina,
  Imprimir,
  Kiosko

]).component(name, {
  template,
  controllerAs: name,
  controller: Afkar
})
  .config(config);

function config($locationProvider, $urlRouterProvider, $mdThemingProvider) {
  'ngInject';

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/afkar');

  $mdThemingProvider.theme('default')
  // .primaryPalette('blue')
  // .accentPalette('yellow');

}