import angular from 'angular';
import uiRouter from 'angular-ui-router';
import complianceComponent from './compliance.component';

let complianceModule = angular.module('compliance', [
        uiRouter
    ])

    .config(($stateProvider) => {
        "ngInject";
        $stateProvider
            .state('compliance', {
                url: '/compliance',
                template: '<compliance></compliance>'
            });
    })
    .component('compliance', complianceComponent);

export default complianceModule;
