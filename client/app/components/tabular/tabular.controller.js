import _ from 'lodash';

class TabularController {
    constructor(LabResultsService, $scope, $timeout, NgTableParams, $q, $filter) {
        this.name = 'tabular';
        this.LabResultsService = LabResultsService;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$q = $q;
        this.$filter = $filter;

        // Defaults
        var defaultGraphs = ['LY', 'CA', 'HBGL'];
        var startDate = "2014-04-25";
        var endDate = "2014-05-10";

        // ui-sortable options
        $scope.sortableOptions = {
            handle: '.grippy'
        }

        $scope.startDatePopup = function() {
            $scope.startDatePopup.opened = true;
        };
        $scope.endDatePopup = function() {
            $scope.endDatePopup.opened = true;
        };

        // Initialise graphs
        var codes = LabResultsService.codes;
        this.graphs = [];
        var vm = this;
        codes.forEach(function (code) {
            var graph = {
                code: code.code,
                label: code.label,
                active: false,
                cells: [],
                series: []
            };
            vm.graphs.push(graph);
        });

        // Get patients
        this.patients = LabResultsService.getPatients();
        $scope.patient = this.patients[0];

        // Set dates
        $scope.startDate = new Date(startDate);
        $scope.endDate = new Date(endDate);

        // Load initial graphs
        this.activeGraphs = [];
        this.dates = [];
        defaultGraphs.forEach(function(code) {
           vm.addGraph(code);
        });

        $scope.$watchGroup(["patient", "startDate", "endDate"], function() {
            vm.dates = [];
            vm.activeGraphs.forEach(function(graph) {
                vm.processGraph(graph, vm.$scope.patient.id, vm.$scope.startDate, vm.$scope.endDate);
            });
        });

    }

    addGraph(code) {
        var graph = _.find(this.graphs, {'code': code});
        if (graph && !graph.active) {
            graph.active = true;
            this.processGraph(graph, this.$scope.patient.id, this.$scope.startDate, this.$scope.endDate);
            this.activeGraphs.push(graph);
        }
    }

    processGraph(graph, patientId, startDate, endDate) {
        var vm = this;
        this.LabResultsService.getSeries(graph.code, patientId, startDate, endDate)
            .then(function (seriesData) {
                graph.series = seriesData;
                vm.addGraphToDates(graph, vm.dates);
            })
            .then(function () {
                graph.cells = vm.generateCells(graph);
            });
    }

    addGraphToDates(graph, dates) {
        var vm = this;
        graph.series.forEach(function (datum) {
            var index = _.findIndex(dates, { 'dateIndex': datum.dateIndex });
            if (index == -1) {
                index = _.sortedIndex(dates, {'dateIndex': datum.dateIndex}, 'dateIndex');
                dates.splice(index, 0, {
                    dateIndex: datum.dateIndex,
                    date: datum.date,
                    dateObj: datum.dateObj,
                    codes: []
                });
                vm.padCells(datum.dateIndex);
            }
            if (dates[index].codes.indexOf(graph.code) == -1) {
                dates[index].codes.push(graph.code);
            }
        });
    }

    padCells(dateIndex) {
        this.activeGraphs.forEach(function(graph) {
            if(graph.cells.length) {
                var index = _.sortedIndex(graph.cells, {'dateIndex': dateIndex}, 'dateIndex');
                graph.cells.splice(index, 0, [])
            }
        });
    }

    generateCells(graph) {
        var graphIndex = 0;
        var cells = [];
        _.forEach(this.dates, function (date) {
            var cell = {
                values: [],
                dateIndex: date.dateIndex
            };
            while (graph.series[graphIndex] && graph.series[graphIndex].dateIndex == date.dateIndex) {
                cell.values.push(graph.series[graphIndex]);
                graphIndex++;
            }
            cells.push(cell);
        });
        return cells;
    }

    selectPatient(patient) {
        this.$scope.patient = patient;
    }

    removeGraph(index) {
        var removed = this.activeGraphs.splice(index, 1);
        var graph = _.find(this.graphs, {'code': removed[0].code});
        if (graph && graph.active) {
            graph.active = false;
        }
    }

    loadData(NgTableParams) {

        var vm = this;

        this.data = [];

        // Create table column list
        this.colsList = [{
            field: 'date',
            title: 'Date',
            show: true
        }];

        this.activeGraphs.forEach(function (graph) {
            vm.colsList.push({
                field: graph.code,
                title: graph.label,
                show: true
            });
        });
        this.cols = _.indexBy(this.colsList, 'field');

        var startDate = new Date(this.$scope.startDate);
        var endDate = new Date(this.$scope.endDate);

        this.$scope.startDate = startDate;
        this.$scope.endDate = endDate;

        var promises = [];
        this.activeGraphs.forEach(function (graph) {
            var promise = vm.LabResultsService.getSeries(graph.code, vm.$scope.patient.id, startDate, endDate);
            promise.then(function (res) {
                vm.data[graph.code] = res;
            });
            promises.push(promise);
        });

        var addToAllData = function (allData, series, key) {
            series.forEach(function (item) {
                var index = (item.dateIndex - startDate.getTime()) / 86400000;
                if (!allData[index]) {
                    allData[index] = {};
                }
                allData[index].date = item.date;
                allData[index].dateObj = item.dateObj;
                allData[index][key] = item.value;
            });
        };

        this.$q.all(promises).then(function (data) {
            vm.timeIndexedData = [];
            for (var index in data) {
                var key = vm.activeGraphs[index].code;

                // add data to keys
                addToAllData(vm.timeIndexedData, data[index], key);
            }
            vm.timeIndexedData.forEach(function (item) {
                vm.activeGraphs.forEach(function (graph) {
                    if (!item[graph.code]) {
                        item[graph.code] = '-';
                    }
                });
            });
        });

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
