import template from './fhirTest.html';
import controller from './fhirTest.controller';
import './fhirTest.styl';

let fhirTestComponent = {
  restrict: 'E',
  template,
  controller,
  controllerAs: 'vm'
};

export default fhirTestComponent;
