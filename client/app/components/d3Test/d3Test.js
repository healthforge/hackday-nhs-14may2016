import angular from 'angular';
import uiRouter from 'angular-ui-router';
import d3TestComponent from './d3Test.component';

let d3TestModule = angular.module('d3Test', [
  uiRouter
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state('d3Test', {
      url: '/d3Test',
      template: '<d3-test></d3-test>'
    });
})

.component('d3Test', d3TestComponent);

export default d3TestModule;
