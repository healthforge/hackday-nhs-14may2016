import template from './graphD3.html';
import './graphD3.styl';
import d3 from 'd3';

let graphD3Component = function (LabResultsService) {
    return {
        restrict: 'E',
        scope: {
            patient: '=patient',
            brush: '=brush',
        },
        template,
        link: function (scope, element, attrs) {
            var el = element[0].childNodes[0];
            scope.$watch('patient', function (patient) {
                if (typeof(patient) !== 'undefined') {
                    LabResultsService.getSeries(attrs.code, patient).then(function (seriesData) {
                        var margin = {top: 10, right: 10, bottom: 10, left: 40},
                            width = 950 - margin.left - margin.right,
                            height = 200 - margin.top - margin.bottom;

                        var x = d3.time.scale().range([0, width]),
                            y = d3.scale.linear().range([height, 0]);

                        var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);

                        var seriesLine = d3.svg.line()
                            .x(function (d) {
                                return x(d.parsed);
                            })
                            .y(function (d) {
                                return y(d.value);
                            });

                        var svg = d3.select(el)
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom);

                        // Remove any existing content
                        svg.selectAll("g").remove();

                        var clip = svg.append("defs").append("svg:clipPath")
                            .attr("id", "clip")
                            .append("svg:rect")
                            .attr("width", width)
                            .attr("height", height);

                        var focus = svg.append("g")
                            .attr("class", "focus")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                        var parseDateTime = d3.time.format.iso.parse;
                        seriesData.forEach(function (d) {
                            d.parsed = parseDateTime(d.effectiveDateTime);
                            d.value = +(d.valueQuantity.value);
                        });

                        // Scale the range of the data
                        x.domain(d3.extent(seriesData, function (d) {
                            return d.parsed;
                        }));
                        y.domain(d3.extent(seriesData, function (d) {
                            return d.value;
                        }));

                        // Add mouse guide
                        focus.append("g")
                            .append("path")
                            .attr("class", "mouse-line")
                            .style("stroke", "#ddd")
                            .style("stroke-width", "1px")
                            .style("opacity", "0");

                        // Add plot points
                        focus.selectAll("dot")
                            .data(seriesData)
                            .enter().append("circle")
                            .attr("class", "dot")
                            .attr("r", 2)
                            .attr("cx", function(d) { return x(d.parsed); })
                            .attr("cy", function(d) { return y(d.value); });

                        // Add plot line
                        focus.append("path")
                            .datum(seriesData)
                            .attr("class", "line")
                            .attr("d", seriesLine);

                        // Add the X Axis
                        focus.append("svg:line")
                            .attr("class", ".line")
                            .attr("x1", 0)
                            .attr("x2", width)
                            .attr("y1", height)
                            .attr("y2", height);

                        // Add the Y Axis
                        focus.append("g")
                            .attr("class", "y axis")
                            .call(yAxis);

                        // Add hover point highlight
                        focus.append("g")
                            .attr("class", "hover")
                            .style("display", "none")
                            .append("circle")
                            .attr("r", 3);

                        focus.append("rect")
                            .attr("class", "overlay")
                            .attr("width", width)
                            .attr("height", height)
                            .on("mouseover", function () {
                                d3.selectAll(".focus .hover").style("display", null);
                                d3.selectAll(".hover-data").style("display", null);
                                d3.selectAll(".mouse-line").style("opacity", "1");
                            })
                            .on("mouseout", function () {
                                d3.selectAll(".focus .hover").style("display", "none");
                                d3.selectAll(".hover-data").style("display", "none");
                                d3.selectAll(".mouse-line").style("opacity", "0");
                            })
                            .on("mousemove", mousemove);

                        var bisectDate = d3.bisector(function (d) {
                            return d.parsed;
                        }).left;

                        function mousemove() {
                            var mouse = d3.mouse(this);
                            var date = x.invert(mouse[0]);
                            var lines = d3.selectAll(".line");
                            lines.each(function(ds, row) {

                                // Update hover points
                                var i = bisectDate(ds, date, 1),
                                    d0 = ds[i - 1],
                                    d1 = ds[i],
                                    d = date - d0.parsed > d1.parsed - date ? d1 : d0;
                                if(scope.brush.fromDate && scope.brush.toDate) {
                                    x.domain([
                                        scope.brush.fromDate,
                                        scope.brush.toDate
                                    ]);
                                } else {
                                    x.domain(d3.extent(ds, function (d) {
                                        return d.parsed;
                                    }));
                                }
                                y.domain(d3.extent(ds, function (d) {
                                    return d.value;
                                }));
                                d3.select(this.parentNode).select(".hover")
                                    .attr("transform", "translate(" + x(d.parsed) + "," + y(d.value) + ")");

                                // Update hover values
                                var hoverData = d3.selectAll(".hover-data")[0][row];
                                d3.select(hoverData).select(".hover-value").text(d3.round(d.value,2));
                                d3.select(hoverData).select(".hover-unit").text(d.valueQuantity.code);
                                var formatDate = d3.time.format("%Y-%m-%d");
                                d3.select(hoverData).select(".hover-date").text(formatDate(d.parsed));

                                // Update mouse guides
                                d3.select(this.parentNode).select(".mouse-line")
                                    .attr("d", function () {
                                        var d = "M" + mouse[0] + "," + height;
                                        d += " " + mouse[0] + "," + 0;
                                        return d;
                                    });
                            });
                        }
                    });
                }
            });
        }
    };
};

graphD3Component.$inject = ['LabResultsService'];

export default graphD3Component;
