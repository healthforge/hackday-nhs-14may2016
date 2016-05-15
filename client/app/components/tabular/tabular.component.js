import template from './tabular.html';
import controller from './tabular.controller';
import './_tabular.styl';

let tabularComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default tabularComponent;
