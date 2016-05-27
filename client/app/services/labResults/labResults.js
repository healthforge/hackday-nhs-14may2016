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
        if (this.offline) {
            return this.$http.get(patients, {cache: true})
                .then(function (res) {
                    return res.data;
                });
        } else {
            var defer = this.$q.defer();
            FHIR.oauth2.ready(function (smart) {
                smart.api.search({
                    type: "Patient"
                }).then(function (res) {
                    defer.resolve(res.data);
                });
            });
            return defer.promise;
        }
    }

    getCodes() {
        return this.$http.get(indicators)
            .then(function (res) {
                var parsed = [];
                res.data.forEach(function (record) {
                    parsed.push({
                        "code": record.code,
                        "label": record.label,
                        "indicator": record.indicator
                    });
                });
                return parsed;
            });
    }

    getSeries(type, patient, startDate, endDate) {
        var vm = this;
        if (this.offline) {
            return this.$http.get(observations)
                .then(function (res) {
                    var parsed = [];
                    var line = {};
                    res.data.forEach(function (record) {
                        if (type in record.lines && record.patientId == patient.identifier[0].value) {
                            line = record.lines[type];
                            line.date = record.timestamp;
                            line.dateObj = new Date(record.timestamp);
                            line.dateIndex = line.dateObj.getTime();
                            if ((typeof startDate === 'undefined' || line.dateObj >= startDate)
                                && (typeof endDate === 'undefined' || line.dateObj <= endDate)) {
                                parsed.push(line);
                            }
                        }
                    });
                    var sorted = vm.$filter('orderBy')(parsed, 'date');
                    return sorted;
                });
        } else {
            var defer = this.$q.defer();
            var query = {
                patient: patient.id,
                code: type,
                _count: 100
            };
            if (typeof(startDate) !== 'undefined' || typeof(endDate) !== 'undefined') {
                query.date = {};
                if (typeof(startDate) !== 'undefined') {
                    query.date.$ge = vm.$filter('date')(startDate, "yyyy-MM-dd");
                }
                if (typeof(endDate) !== 'undefined') {
                    query.date.$le = vm.$filter('date')(endDate, "yyyy-MM-dd");
                }
            }
            FHIR.oauth2.ready(function (smart) {
                smart.api.fetchAll({
                    type: 'Observation',
                    query: query
                }).then(function (res) {
                    // Server side sorting doesn't seem to work for observations
                    var sorted = vm.$filter('orderBy')(res, 'effectiveDateTime');
                    defer.resolve(sorted);
                });
            });
            return defer.promise;
        }
    }

}

LabResultsService.$inject = ['$http', '$filter', '$q'];

export default LabResultsService;