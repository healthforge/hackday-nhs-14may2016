class GraphController {
  constructor($filter) {
    this.name = 'graph';
    this.graphs = [
      { 
        code: 'ALB',
        label: 'ALB',
        active: false
      },
      { 
        code: 'ALT',
        label: 'ALT',
        active: false
      },
      { 
        code: 'PHOS',
        label: 'Phosphorus',
        active: true
      },
      { 
        code: 'PLT',
        label: 'Platelets',
        active: true
      },
      { 
        code: 'CA',
        label: 'Calcium',
        active: false
      }
    ];

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

GraphController.$inject = ['$filter'];

export default GraphController;
