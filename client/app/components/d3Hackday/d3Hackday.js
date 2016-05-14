import angular from 'angular';
import uiRouter from 'angular-ui-router';
import d3HackdayComponent from './d3Hackday.component';

let d3HackdayModule = angular.module('d3Hackday', [
        uiRouter
    ])
    .directive('d3Hackday', d3HackdayComponent);

export default d3HackdayModule;
