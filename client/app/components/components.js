import angular from 'angular';
import Home from './home/home';
import graph from './graph/graph';
import tabular from './tabular/tabular';

let componentModule = angular.module('app.components', [
  Home.name,
  graph.name,
  tabular.name
]);

export default componentModule;
