import D3TestModule from './d3Test'
import D3TestController from './d3Test.controller';
import D3TestComponent from './d3Test.component';
import D3TestTemplate from './d3Test.html';

describe('D3Test', () => {
  let $rootScope, makeController;

  beforeEach(window.module(D3TestModule.name));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new D3TestController();
    };
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    it('has a name property [REMOVE]', () => { // erase if removing this.name from the controller
      let controller = makeController();
      expect(controller).to.have.property('name');
    });
  });

  describe('Template', () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
    it('has name in template [REMOVE]', () => {
      expect(D3TestTemplate).to.match(/{{\s?vm\.name\s?}}/g);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = D3TestComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(D3TestTemplate);
      });

      it('uses `controllerAs` syntax', () => {
        expect(component).to.have.property('controllerAs');
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(D3TestController);
      });
  });
});
