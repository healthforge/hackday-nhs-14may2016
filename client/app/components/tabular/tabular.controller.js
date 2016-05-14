class TabularController {
  constructor(LabResultsService, $scope, $timeout, NgTableParams) {
    this.name = 'tabular';
    this.LabResultsService = LabResultsService;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.loadData(NgTableParams);
  }
  
  loadData(NgTableParams) {
    this.data = [{name: 'Moroni', age: 50} /*,*/];
    // this.tableParams = new NgTableParams({}, { dataset: this.data})
    this.tableParams = new NgTableParams(
      {page: 1, count: 10},
      {
        total: 0,
        data: this.data,
        getData: function ($defer, params) {
          var filter = params.filter();
          var sorting = params.sorting();
          var count = params.count();
          var page = params.page();
          $defer.resolve(this.data);
      }
    });
  }
}

TabularController.$inject = ['LabResultsService', '$scope', '$timeout', 'NgTableParams'];

export default TabularController;
