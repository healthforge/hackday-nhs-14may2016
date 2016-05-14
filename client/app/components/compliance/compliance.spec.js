import ComplianceModule from './compliance'
import ComplianceController from './compliance.controller';
import ComplianceComponent from './compliance.component';
import ComplianceTemplate from './compliance.html';

describe('Compliance', () => {
  let $rootScope, makeController;

  beforeEach(window.module(ComplianceModule.name));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new ComplianceController();
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
      expect(ComplianceTemplate).to.match(/{{\s?vm\.name\s?}}/g);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = ComplianceComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(ComplianceTemplate);
      });

      it('uses `controllerAs` syntax', () => {
        expect(component).to.have.property('controllerAs');
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(ComplianceController);
      });
  });
});
