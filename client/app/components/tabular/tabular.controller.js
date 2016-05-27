import _ from 'lodash';

class TabularController {
    constructor($scope, $q, LabResultsService) {
        this.name = 'tabular';

        var vm = this;
        this.LabResultsService = LabResultsService;
        this.$scope = $scope;

        // Defaults
        var defaultCodes = ['777-3', '17861-6', '718-7'];
        var startDate = "2014-04-25";
        var endDate = "2014-05-10";

        // UI options
        $scope.sortableOptions = {
            handle: '.grippy'
        }
        $scope.startDatePopup = function() {
            $scope.startDatePopup.opened = true;
        };
        $scope.endDatePopup = function() {
            $scope.endDatePopup.opened = true;
        };

        // Get codes
        this.graphs = [];
        this.activeGraphs = [];
        var codesPromise = LabResultsService.codes.then(function (codes) {
            codes.forEach(function (code) {
                code.active = false;
                code.cells = [];
                code.series = [];
                vm.graphs.push(code);
            });
        });

        // Get patients
        var patientsPromise = LabResultsService.getPatients().then(function (bundle) {
            vm.patients = bundle.entry;
            $scope.patient = vm.patients[0].resource;
        });

        // Set dates
        $scope.startDate = new Date(startDate);
        $scope.endDate = new Date(endDate);

        // Populate default graphs
        this.dates = [];
        $q.all([codesPromise, patientsPromise]).then(function () {
            defaultCodes.forEach(function (code) {
                vm.addGraph(code);
            });
        })

        $scope.$watchGroup(["patient", "startDate", "endDate"], function() {
            vm.dates = [];
            vm.activeGraphs.forEach(function(graph) {
                vm.processGraph(graph, vm.$scope.patient, vm.$scope.startDate, vm.$scope.endDate);
            });
        });

    }

    addGraph(code) {
        var graph = _.find(this.graphs, {'code': code});
        if (graph && !graph.active) {
            graph.active = true;
            this.processGraph(graph, this.$scope.patient, this.$scope.startDate, this.$scope.endDate);
            this.activeGraphs.push(graph);
        }
    }

    processGraph(graph, patient, startDate, endDate) {
        var vm = this;
        this.LabResultsService.getSeries(graph.code, patient, startDate, endDate)
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
            datum.dateObj = new Date(datum.effectiveDateTime);
            datum.dateIndex = datum.dateObj.getTime();
            var index = _.findIndex(dates, { 'dateIndex': datum.dateIndex });
            if (index == -1) {
                index = _.sortedIndex(dates, {'dateIndex': datum.dateIndex}, 'dateIndex');
                dates.splice(index, 0, {
                    dateIndex: datum.dateIndex,
                    date: datum.effectiveDateTime,
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

}

TabularController.$inject = ['$scope', '$q', 'LabResultsService'];

export default TabularController;
