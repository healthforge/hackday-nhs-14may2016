import template from './graph.html';
import controller from './graph.controller';
import './graph.styl';

let graphComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default graphComponent;
