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
    var plt = this.LabResultsService.getSeries('PLT');
    var vm = this;
    plt.then(function(res) {
      vm.data.plt = res;
    });
  }
}

TabularController.$inject = ['LabResultsService', '$scope', '$timeout'];

export default TabularController;
