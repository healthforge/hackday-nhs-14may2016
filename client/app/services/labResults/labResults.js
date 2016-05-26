import observations from 'file!./observations.json';
import indicators from 'file!./indicators.json';
import patients from 'file!./patients.json';
import 'lodash';

class LabResultsService {
    constructor($http, $filter, $q) {
        this.offline = (process.env.OFFLINE === 'true');
        this.$http = $http;
        this.$filter = $filter;
        this.$q = $q;
        this.codes = this.getCodes();
    }

    getPatients() {
        if(this.offline) {
            return this.$http.get(patients, { cache: true })
                .then(function(res){
                    return res.data;
                });
        } else {
            var defer = this.$q.defer();
            FHIR.oauth2.ready(function(smart){
                smart.api.search({
                    type: "Patient"
                }).then(function(res){
                    defer.resolve(res.data);
                });
            });
            return defer.promise;
        }
    }

    getCodes() {
        return this.$http.get(indicators)
            .then(function(res){
                var parsed = [];
                res.data.forEach(function(record) {
                    parsed.push({
                        "code": record.indicator,
                        "label":record.label
                    });
                });
                return parsed;
            });
    }

    getSeries(type, patient, startDate, endDate) {
        var vm = this;
        return this.$http.get(observations)
            .then(function(res){
                var parsed = [];
                var line = {};
                res.data.forEach(function(record) {
                    if(type in record.lines && record.patientId == patient.identifier[0].value) {
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

LabResultsService.$inject = ['$http', '$filter', '$q'];

export default LabResultsService;