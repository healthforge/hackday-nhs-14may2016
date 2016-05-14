import angular from 'angular';
import uiRouter from 'angular-ui-router';
import complianceComponent from './compliance.component';
import d3Hackday from '../d3Hackday/d3Hackday';

let complianceModule = angular.module('compliance', [
        uiRouter,
        d3Hackday.name
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
