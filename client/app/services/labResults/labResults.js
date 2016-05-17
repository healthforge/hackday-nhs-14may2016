import labResults from 'file!./labResults.json';
import labCodes from 'raw!./labresults-codes.csv';

class LabResultsService {
    constructor($http, $filter) {
        this.patientId = '40681648';
        this.$http = $http;
        this.$filter = $filter;
        this.codes = this.getCodes();
        var vm = this;
    }

    getCodes() {
        var records = labCodes.split(/\r?\n/);
        var codes = [];
        records.forEach(function(line) {
            var fields = line.split(/,/);
            codes.push({
                code: fields[0],
                label: fields[2]
            });
        });
        return codes;
    }

    getSeries(type) {
        var vm = this;
        return this.$http.get(labResults)
            .then(function(res){
                var parsed = [];
                var line = {};
                res.data.forEach(function(record) {
                    if(type in record.lines && record.patientId == vm.patientId) {
                        line = record.lines[type];
                        line.patientId = record.patientId;
                        line.date = record.timestamp;
                        line.dateObj = new Date(record.timestamp);
                        parsed.push(line);
                    }
                });
                var sorted = vm.$filter('orderBy')(parsed, 'date');
                return sorted;
            });
    }

    getSeriesSparkline(type, startDate, endDate) {
        var vm = this;
        return this.$http.get(labResults)
            .then(function(res){
                var parsed = [];
                var line = {};
                res.data.forEach(function(record) {
                    if(type in record.lines) {
                        line = record.lines[type];
                        line.patientId = record.patientId;
                        line.date = record.timestamp;
                        line.dateObj = new Date(record.timestamp);
                        if((line.dateObj >= startDate) && (line.dateObj <= endDate)) {
                            parsed.push(line);
                        }
                    }
                });
                var sorted = vm.$filter('orderBy')(parsed, 'date');
                return sorted;
            });
    }

    getSeries2(type, startDate, endDate) {
        var vm = this;
        return this.$http.get(labResults)
            .then(function(res){
                var parsed = [];
                var line = {};
                res.data.forEach(function(record) {
                    if(type in record.lines && record.patientId == vm.patientId) {
                        line = record.lines[type];
                        line.patientId = record.patientId;
                        line.date = record.timestamp;
                        line.dateObj = new Date(record.timestamp);
                        line.dateIndex = line.dateObj.getTime();
                        if((line.dateObj >= startDate) && (line.dateObj <= endDate)) {
                            parsed.push(line);
                        }
                    }
                });
                var sorted = vm.$filter('orderBy')(parsed, 'date');
                return sorted;
            });
    }
}

LabResultsService.$inject = ['$http', '$filter'];

export default LabResultsService;