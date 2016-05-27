import template from './graphD3.html';
import './graphD3.styl';
import d3 from 'd3';

let graphWindowComponent = function (LabResultsService) {
    return {
        restrict: 'E',
        scope: {
            patient: '=patient',
            setExtent: '&'
        },
        template,
        link: function (scope, element, attrs) {
            var el = element[0].childNodes[0];
            scope.$watch('patient', function (patient) {
                if (typeof(patient) !== 'undefined') {
                    LabResultsService.getSeries(attrs.code, patient).then(function (seriesData) {
                        var margin = {top: 30, right: 10, bottom: 60, left: 40},
                            width = 950 - margin.left - margin.right,
                            height = 160 - margin.top - margin.bottom,
                            height2 = 180;

                        var x = d3.time.scale().range([0, width]),
                            x2 = d3.time.scale().range([0, width]),
                            y = d3.scale.linear().range([height, 0]),
                            y2 = d3.scale.linear().range([height2, 0]);

                        var xAxis = d3.svg.axis().scale(x).orient("bottom");
                        var x2Axis = d3.svg.axis().scale(x2).orient("bottom");

                        var seriesLine = d3.svg.line()
                            .x(function (d) {
                                return x2(d.parsed);
                            })
                            .y(function (d) {
                                return y2(d.value);
                            });

                        var brush = d3.svg.brush()
                            .x(x)
                            .on("brush", brushed);

                        var svg = d3.select(el)
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom);

                        svg.selectAll("g").remove();

                        var context = svg.append("g")
                            .attr("class", "context")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                        var parseDateTime = d3.time.format.iso.parse;
                        seriesData.forEach(function (d) {
                            d.parsed = parseDateTime(d.effectiveDateTime);
                            d.value = +d.valueQuantity.value;
                        });

                        // Scale the range of the data
                        x.domain(d3.extent(seriesData, function (d) {
                            return d.parsed;
                        }));
                        y.domain(d3.extent(seriesData, function (d) {
                            return d.value;
                        }));
                        x2.domain(x.domain());
                        y2.domain(y.domain());

                        var area = d3.svg.area()
                            .interpolate("monotone")
                            .x(function (d) {
                                return x(d.parsed);
                            })
                            .y0(height)
                            .y1(function (d) {
                                return y(d.value);
                            });

                        svg.append("g")
                            .attr("class", "x axis x2")
                            .attr("transform", "translate(40,130)")
                            .call(x2Axis);

                        context.append("path")
                            .datum(seriesData)
                            .attr("class", "area")
                            .attr("d", area);

                        context.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);

                        context.append("g")
                            .attr("class", "x brush")
                            .call(brush)
                            .selectAll("rect")
                            .attr("y", -6)
                            .attr("height", height + 7);

                        function brushed() {
                            if(brush.empty()) {
                                x2.domain(x.domain());
                                scope.setExtent({ extent: [] });
                            } else {
                                x2.domain(brush.extent());
                                scope.setExtent({ extent: brush.extent() });
                            }
                            d3.selectAll(".line").each(function (datum) {
                                y2.domain(d3.extent(datum, function (d) {
                                    return d.value;
                                }));
                                d3.select(this).attr("d", seriesLine(datum));
                                d3.select(this.parentNode).selectAll(".dot")
                                    .data(datum)
                                    .attr("cx", function(d) { return x2(d.parsed); })
                                    .attr("cy", function(d) { return y2(d.value); });
                            });
                            svg.select(".x2").call(x2Axis);
                        }
                    });
                }
            });
        }
    };
};

graphWindowComponent.$inject = ['LabResultsService'];

export default graphWindowComponent;
