import template from './tabular.html';
import controller from './tabular.controller';
import './tabular.styl';

let tabularComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default tabularComponent;
