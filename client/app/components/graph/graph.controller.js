class GraphController {
  constructor() {
    this.name = 'graph';
    this.graphs = [
      {
        code: 'PLT'
      },
      {
        code: 'ALT'
      }
    ];
    this.codes = [
      { code: 'ALB' },
      { code: 'ALT' },
      { code: 'PHOS' },
      { code: 'PLT' },
      { code: 'CA' },
    ];
    this.selected = null;
  }

  addGraph(code) {
    this.graphs.push({
      code: code
    });
  }

  removeGraph(item) {
    var index = this.graphs.map(function(x) { return x.code; }).indexOf(item);
    this.graphs.splice(index, 1);
  }
}

export default GraphController;
