class GraphController {
  constructor($filter, LabResultsService) {
    this.name = 'graph';
    var codes = LabResultsService.codes;
    var active = ['PLT', 'CA'];
    this.graphs = [];
    var vm = this;
    codes.forEach(function(code) {
      var graph = {
        code: code.code,
        label: code.label,
        active: false
      };
      if(active.indexOf(code.code) > -1) {
        graph.active = true;
      }
      vm.graphs.push(graph);
    });
    this.activeGraphs = $filter('filter')(this.graphs, { active: true });
  }

  addGraph(code) {
    var graph = _.find(this.graphs, { 'code': code });
    if(graph && !graph.active) {
      graph.active = true;
      this.activeGraphs.push(graph);
    }
  }

  removeGraph(index) {
    var removed = this.activeGraphs.splice(index, 1);
    var graph = _.find(this.graphs, { 'code': removed[0].code });
    if(graph && graph.active) {
      graph.active = false;
    }
  }
}

GraphController.$inject = ['$filter', 'LabResultsService'];

export default GraphController;
