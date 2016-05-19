import angular from 'angular';
import uiRouter from 'angular-ui-router';
import 'jquery-ui';
import 'angular-ui-sortable';
import 'ng-table';
import tabularComponent from './tabular.component';
import sparkline from './sparkline/sparkline';

let tabularModule = angular.module('tabular', [
    uiRouter,
    'ui.sortable',
    'ngTable',
    sparkline.name
])

    .config(($stateProvider) => {
        "ngInject";
        $stateProvider
            .state('tabular', {
                url: '/tabular',
                template: '<tabular></tabular>'
            });
    })
    .component('tabular', tabularComponent);

export default tabularModule;
