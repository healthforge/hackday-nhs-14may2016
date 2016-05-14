class GraphController {
  constructor(LabResultsService, $scope, $timeout) {
    this.name = 'graph';
    this.LabResultsService = LabResultsService;
    this.$scope = $scope;
  }
}

GraphController.$inject = ['LabResultsService', '$scope', '$timeout'];

export default GraphController;
