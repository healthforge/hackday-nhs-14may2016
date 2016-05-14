import angular from 'angular';
import uiRouter from 'angular-ui-router';
import fhirTestComponent from './fhirTest.component';

let fhirTestModule = angular.module('fhirTest', [
  uiRouter
])

.config(($stateProvider) => {
  "ngInject";
  $stateProvider
    .state('fhirTest', {
      url: '/fhirTest/:patientId',
      template: '<fhir-test></fhir-test>'
    });
})

.component('fhirTest', fhirTestComponent);

export default fhirTestModule;
