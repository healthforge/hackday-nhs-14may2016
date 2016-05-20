import _ from 'lodash';

class GraphController {
    constructor($scope, $q, LabResultsService) {
        this.name = 'graph';

        var vm = this;
        this.$scope = $scope;

        // Defaults
        var defaultCodes = ['PLT', 'CA', 'HBGL'];
        
        // Get codes
        this.graphs = [];
        this.activeGraphs = [];
        var codesPromise = LabResultsService.codes.then(function (codes) {
            codes.forEach(function (code) {
                code.active = false;
                vm.graphs.push(code);
            });
        });

        // Get patients
        var patientsPromise = LabResultsService.patients.then(function (patients) {
            vm.patients = patients;
            $scope.patient = patients[0];
        });

        // Populate default graphs
        $q.all([codesPromise, patientsPromise]).then(function () {
            defaultCodes.forEach(function (code) {
                vm.addGraph(code);
            });
        })
    }

    selectPatient(patient) {
        this.$scope.patient = patient;
    }

    addGraph(code) {
        var graph = _.find(this.graphs, {'code': code});
        if (graph && !graph.active) {
            graph.active = true;
            this.activeGraphs.push(graph);
        }
    }

    removeGraph(index) {
        var removed = this.activeGraphs.splice(index, 1);
        var graph = _.find(this.graphs, {'code': removed[0].code});
        if (graph && graph.active) {
            graph.active = false;
        }
    }
}

GraphController.$inject = ['$scope', '$q', 'LabResultsService'];

export default GraphController;
