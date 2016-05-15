class TabularController {
  constructor(LabResultsService, $scope, $timeout, NgTableParams, $q) {
    this.name = 'tabular';
    this.LabResultsService = LabResultsService;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$q = $q;
    this.loadData(NgTableParams);
  }
  
  loadData(NgTableParams) {

    var join = function(lookupTable, mainTable, lookupKey, mainKey, select) {
        console.log(lookupTable);
        var l = lookupTable.length,
            m = mainTable.length,
            lookupIndex = [],
            output = [];
        for (var i = 0; i < l; i++) { // loop through l items
            var row = lookupTable[i];
            lookupIndex[row[lookupKey]] = row; // create an index for lookup table
        }
        for (var j = 0; j < m; j++) { // loop through m items
            var y = mainTable[j];
            var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
            output.push(select(y, x)); // select only the columns you need
        }
        return output;
    };

    this.data = [];
    var vm = this;

    var promisePlt = this.LabResultsService.getSeries('PLT');
    promisePlt.then(function(res) {
      vm.data['plt'] = res;
    });

    var promiseCrea = this.LabResultsService.getSeries('CREA');
    promiseCrea.then(function(res) {
      vm.data['crea'] = res;
    });

    // var promiseCrea = this.LabResultsService.getSeries('UREA');
    // promiseUrea.then(function(res) {
    //   vm.data['urea'] = res;
    // });

    this.$q.all([
      promiseCrea,
      promisePlt
    ]).then(function(data) {
      vm.data['all'] = join(
        data[0],
        data[1],
        'date',
        'date',
        function(plt, crea) {
          console.log(plt)
          console.log(crea)
          return {
              patientId: plt.patientId,
              date: plt.date,
              plt: plt.value,
              crea: (crea !== undefined) ? crea.value : null
          };
        });
    })
    
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
      }
    );
  }
}

TabularController.$inject = ['LabResultsService', '$scope', '$timeout', 'NgTableParams', '$q'];

export default TabularController;
