class FhirTestController {
	constructor($scope, $stateParams) {
		this.name = 'fhirTest';
		this.$scope = $scope;
		this.$stateParams = $stateParams;
		this.fhirResult = 'Loading...';
		this.loadData();
	}

	loadData() {
		/*var demo = {
			serviceUrl: "https://fhir-open-api-dstu2.smarthealthit.org",
			patientId: "1137192"
		};

		var smart = FHIR.client(demo);*/

		console.log("FhirTestController.loadData:");

		var fhirTestController = this;

		FHIR.oauth2.ready(function(smart){
			smart.api.search({
				type: "Observation", query: {subject: "99912345"}
			}).then(function(r){
				//console.log(JSON.stringify(r,null,2));
				fhirTestController.updateValue(r);
			});
		});

		this.fhirResult = 'After sleep';
	}

	updateValue(val) {
		console.log("in updateValue...");
		console.log(this);
		this.fhirResult = val;
		this.data = [];
		this.data.push(Math.random());
		this.data.push(Math.random());
		this.data.push(Math.random());
		this.data.push(Math.random());
		this.data.push(Math.random());
		this.data.push(Math.random());
		this.data.push(Math.random());
		this.data.push(Math.random());
		this.data.push(Math.random());
		this.data.push(Math.random());
		this.data.push(Math.random());
		this.data.push(Math.random());
		console.log("after updateValue...");
		console.log(this);
		this.$scope.$apply();
	}
}

FhirTestController.$inject = ['$scope', '$stateParams'];

export default FhirTestController;
