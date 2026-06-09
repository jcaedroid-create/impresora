import angular from 'angular';
import angularMeteor from 'angular-meteor';
import template from './nav.html';
import './nav.less';



class Nav {
  constructor($reactive, $scope) {
    $reactive(this).attach($scope);

    this.helpers({
      afkar(){
      }

    })
  }

}

const name = 'nav';

export default angular.module(name, [
  angularMeteor
  ])
.component(name, {
  template,
  controller: ['$reactive', '$scope', Nav],
  controllerAs: "Nav"
});
