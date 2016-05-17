import angular from 'angular';
import uiRouter from 'angular-ui-router';
import 'jquery-ui';
import 'angular-ui-sortable';
import 'lodash';
import graphComponent from './graph.component';
import graphD3 from './graphD3/graphD3';


let graphModule = angular.module('graph', [
    uiRouter,
    'ui.sortable',
    graphD3.name
])

    .config(($stateProvider) => {
        "ngInject";
        $stateProvider
            .state('graph', {
                url: '/graph',
                template: '<graph></graph>'
            });
    })
    .component('graph', graphComponent);

export default graphModule;
