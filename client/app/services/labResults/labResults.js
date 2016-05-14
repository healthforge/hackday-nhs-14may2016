import labResults from 'file!./labResults.json';

class LabResultsService {
    constructor($http, $filter) {
        this.data = $http.get(labResults)
            .then(function(res){
                var parsed = [];
                var line = {};
                res.data.forEach(function(record) {
                    if('HBGL' in record.lines && record.patientId == '40681648') {
                        line = record.lines.HBGL;
                        line.patientId = record.patientId;
                        line.date = record.timestamp;
                        parsed.push(line);
                    }
                });
                var sorted = $filter('orderBy')(parsed, 'date');
                return sorted;
            });
    }

    getPlt() {
        return this.data;
    }

    getNe() {
        return [
            { date: '2016-04-01', value: 20 },
            { date: '2016-04-02', value: 15 },
            { date: '2016-04-03', value: 10 },
            { date: '2016-04-04', value: 7 },
            { date: '2016-04-05', value: 5 },
            { date: '2016-04-06', value: 4 }
        ]
    }
}

LabResultsService.$inject = ['$http', '$filter'];

export default LabResultsService;