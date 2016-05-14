class FhirPatientSearchController {
	constructor($scope) {
		this.name = 'fhirPatientSearch';
		this.$scope = $scope;
		
		this.isLoading = false;
		this.searchTerms = null;

		this.loadData();
	}

	loadData() {
		var controller = this;

		var query = { _sort: "family" };

		if(this.searchTerms && this.searchTerms.length > 0) {
			query.name = this.searchTerms;
		}

		this.isLoading = true;

		FHIR.oauth2.ready(function(smart){
			smart.api.search({
				type: "Patient", query: query
			}).then(function(r){
				console.log(JSON.stringify(r,null,2));
				controller.isLoading = false;
				controller.updatePatients(r);
			});
		});
	}

	updatePatients(val) {
		console.log("in updateValue...");
		console.log(this);
		this.patients = val;
		console.log("after updateValue...");
		console.log(this);
		this.$scope.$apply();
	}
}

FhirPatientSearchController.$inject = ['$scope'];

export default FhirPatientSearchController;
