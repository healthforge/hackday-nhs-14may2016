import angular from 'angular';
import uiRouter from 'angular-ui-router';
import fhirPatientSearchComponent from './fhirPatientSearch.component';

let fhirPatientSearchModule = angular.module('fhirPatientSearch', [
  uiRouter
])

.component('fhirPatientSearch', fhirPatientSearchComponent);

export default fhirPatientSearchModule;
