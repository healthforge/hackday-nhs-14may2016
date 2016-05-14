import template from './fhirPatientSearch.html';
import controller from './fhirPatientSearch.controller';
import './fhirPatientSearch.styl';

let fhirPatientSearchComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default fhirPatientSearchComponent;
