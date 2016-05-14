class TabularController {
  constructor(LabResultsService, $scope, $timeout) {
    this.name = 'tabular';
    this.LabResultsService = LabResultsService;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.loadData();
  }
  
  loadData() {
    this.data = { plt: [] };
    var promise = this.LabResultsService.getPlt();
    var vm = this;
    promise.then(function(res) {
      vm.$timeout(function() {
        vm.data.plt = res;
      });
    });
    this.data.ne = this.LabResultsService.getNe();
  }
}

TabularController.$inject = ['LabResultsService', '$scope', '$timeout'];

export default TabularController;
