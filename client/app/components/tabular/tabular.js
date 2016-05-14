import angular from 'angular';
import uiRouter from 'angular-ui-router';
import tabularComponent from './tabular.component';
import tabularD3 from './tabularD3/tabularD3';

let tabularModule = angular.module('tabular', [
    uiRouter,
    tabularD3.name
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
