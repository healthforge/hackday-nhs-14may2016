import angular from 'angular';
import uiRouter from 'angular-ui-router';
import sparklineComponent from './sparkline.component';

let sparklineModule = angular.module('sparkline', [
        uiRouter
    ])
    .directive('sparkline', sparklineComponent);

export default sparklineModule;
