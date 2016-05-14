import angular from 'angular';
import uiRouter from 'angular-ui-router';
import graphD3Component from './graphD3.component';

let graphD3Module = angular.module('graphD3', [
        uiRouter
    ])
    .directive('graphD3', graphD3Component);

export default graphD3Module;
