import observations from 'file!./observations.json';
import indicators from 'file!./indicators.json';
import patients from 'file!./patients.json';
import 'lodash';

class LabResultsService {
    constructor($http, $filter) {
        this.$http = $http;
        this.$filter = $filter;
        this.codes = this.getCodes();
        this.patients = this.getPatients();
    }

    getPatients() {
        return this.$http.get(patients)
            .then(function(res){
                return res.data;
            });
    }

    getCodes() {
        return this.$http.get(indicators)
            .then(function(res){
                var parsed = [];
                var line = {};
                res.data.forEach(function(record) {
                    parsed.push({
                        "code": record.indicator,
                        "label":record.label
                    });
                });
                return parsed;
            });
    }

    getSeries(type, patientId, startDate, endDate) {
        var vm = this;
        return this.$http.get(observations)
            .then(function(res){
                var parsed = [];
                var line = {};
                res.data.forEach(function(record) {
                    if(type in record.lines && record.patientId == patientId) {
                        line = record.lines[type];
                        line.patientId = record.patientId;
                        line.date = record.timestamp;
                        line.dateObj = new Date(record.timestamp);
                        line.dateIndex = line.dateObj.getTime();
                        if((typeof startDate === 'undefined' || line.dateObj >= startDate)
                            && (typeof endDate === 'undefined' || line.dateObj <= endDate)) {
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