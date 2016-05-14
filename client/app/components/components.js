import angular from 'angular';
import Home from './home/home';
import graph from './graph/graph';
import tabular from './tabular/tabular';
//import d3Hackday from './d3Hackday/d3Hackday';
let componentModule = angular.module('app.components', [
  Home.name,
  graph.name,
  tabular.name
  //d3Hackday.name
]);

export default componentModule;
