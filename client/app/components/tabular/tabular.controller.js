import _ from 'lodash';
import labCodes from 'raw!./labresults-codes.csv';

class TabularController {
  constructor(LabResultsService, $scope, $timeout, NgTableParams, $q, $filter) {
    this.name = 'tabular';
    this.LabResultsService = LabResultsService;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$q = $q;
    this.loadData(NgTableParams);
    this.$filter = $filter;
  }
  
  loadData(NgTableParams) {

    var addKey = function(key, description) {
      return {
        key: key,
        description: description
      };
    };

    var vm = this;

    vm.data = [];


    var labCodesLines = labCodes.split(/\r?\n/);

    // set the series we want to retrieve
    vm.keys = [];
    labCodesLines.forEach(function(line) {
      //console.log(line);
      var fields = line.split(/,/);
      //console.log(fields);
      vm.keys.push(addKey(fields[0], fields[2]));
    });
    //vm.keys.push(addKey('CREA', 'Creatanine'));

    // create table column list
    vm.colsList = [{
      field: 'date',
      title: 'Date',
      show: true
    }];

    vm.keys.forEach(function(key) {
      vm.colsList.push({
          field: key.key,
          title: key.description,
          show: true
        }
        );
    });
    vm.cols = _.indexBy(vm.colsList, 'field');    

    //console.log(vm.keys);

    var startDate = new Date("2014-04-25");
    var endDate = new Date("2014-05-10");

    this.$scope.startDate = startDate;
    this.$scope.endDate = endDate;

    var promises = [];
    vm.keys.forEach(function(key) {
      var promise = vm.LabResultsService.getSeries2(key.key, startDate, endDate);
      promise.then(function(res) {
        vm.data[key.key] = res;
      });
      promises.push(promise);
    });

    var addToAllData = function(allData, series, key) {
      series.forEach(function(item, collectionIndex, collection) {
        // use the date as the primary key, then set field which is the key
        //var index = item.index; //parseInt(vm.$filter('date')(item.date, 'yyyyMMdd')); // item.dateObj.getTime();
        
        var index = (item.dateIndex - startDate.getTime()) / 86400000;
        //var index = item.index - startDate.getTime() - 86400000;

        if(!allData[index]) {
          allData[index] = {};
        }
        allData[index].date = item.date;
        allData[index].dateObj = item.dateObj;
        allData[index][key] = item.value;
      });
    };

    this.$q.all(promises).then(function(data) {

      vm.timeIndexedData = [];

      for(var index in data) {

        var key = vm.keys[index].key;

        // add data to keys
        addToAllData(vm.timeIndexedData, data[index], key);
      }

      vm.timeIndexedData.forEach(function(item) {
        vm.keys.forEach(function(key) {
          if(!item[key.key]) {
            item[key.key] = '-';
          }
        });
      });


      // vm.data['all'] = join(
      //   data[0],
      //   data[1],
      //   'date',
      //   'date',
      //   function(plt, crea) {
      //     console.log(plt)
      //     console.log(crea)
      //     return {
      //         patientId: plt.patientId,
      //         date: plt.date,
      //         plt: plt.value,
      //         crea: (crea !== undefined) ? crea.value : null
      //     };
      //   });
    });
    
/*    vm.tableParams = new NgTableParams(
      {page: 1, count: 10},
      {
        total: 0,
        data: vm.timeIndexedData,
        getData: function ($defer, params) {
          var filter = params.filter();
          var sorting = params.sorting();
          var count = params.count();
          var page = params.page();
          $defer.resolve(vm.timeIndexedData);
        }
      }
    );*/

    vm.tableParams = new NgTableParams(
      {},
      {
        total: 0,
        data: vm.timeIndexedData
      }
    );

  }
}

TabularController.$inject = ['LabResultsService', '$scope', '$timeout', 'NgTableParams', '$q', '$filter'];

export default TabularController;
