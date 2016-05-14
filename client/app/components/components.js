import angular from 'angular';
import Home from './home/home';
import About from './about/about';
import compliance from './compliance/compliance';
import d3Hackday from './d3Hackday/d3Hackday';

let componentModule = angular.module('app.components', [
  Home.name,
  About.name,
  compliance.name,
  d3Hackday.name
]);

export default componentModule;
