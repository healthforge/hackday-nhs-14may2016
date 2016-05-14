import FhirPatientSearchModule from './fhirPatientSearch'
import FhirPatientSearchController from './fhirPatientSearch.controller';
import FhirPatientSearchComponent from './fhirPatientSearch.component';
import FhirPatientSearchTemplate from './fhirPatientSearch.html';

describe('FhirPatientSearch', () => {
  let $rootScope, makeController;

  beforeEach(window.module(FhirPatientSearchModule.name));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new FhirPatientSearchController();
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
      expect(FhirPatientSearchTemplate).to.match(/{{\s?vm\.name\s?}}/g);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = FhirPatientSearchComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(FhirPatientSearchTemplate);
      });

      it('uses `controllerAs` syntax', () => {
        expect(component).to.have.property('controllerAs');
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(FhirPatientSearchController);
      });
  });
});
