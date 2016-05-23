import template from './sparkline.html';
import './sparkline.styl';
import d3 from 'd3';

let sparklineComponent = function () {
    return {
        restrict: 'E',
        scope: {
            data: '=data'
        },
        template,
        link: function (scope, element, attrs) {
            var el = element[0].childNodes[0];
            scope.$watch('data', function (seriesData) {
                var margin = {top: 5, right: 5, bottom: 5, left: 5},
                    width = attrs.w - margin.left - margin.right,
                    height = attrs.h - margin.top - margin.bottom;

                var x = d3.time.scale().range([0, width]),
                    y = d3.scale.linear().range([height, 0]);

                var pltLine = d3.svg.line()
                    .x(function (d) {
                        return x(d.parsed);
                    })
                    .y(function (d) {
                        return y(d.value);
                    });

                var svg = d3.select(el)
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

                svg.selectAll("g").remove();

                svg.append("defs").append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height);

                var focus = svg.append("g")
                    .attr("class", "focus")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var parseDate = d3.time.format("%Y-%m-%dT%H:%M").parse;
                seriesData.forEach(function (d) {
                    d.parsed = parseDate(d.date);
                    d.value = +d.value;
                });

                // Scale the range of the data
                x.domain(d3.extent(seriesData, function (d) {
                    return d.parsed;
                }));
                y.domain(d3.extent(seriesData, function (d) {
                    return d.value;
                }));

                focus.append("g")
                    .append("path")
                    .attr("class", "mouse-line")
                    .style("stroke", "#ddd")
                    .style("stroke-width", "1px")
                    .style("opacity", "0");

                focus.append("path")
                    .datum(seriesData)
                    .attr("class", "line")
                    .attr("d", pltLine);

                var hover = focus.append("g")
                    .attr("class", "hover")
                    .style("display", "none");

                hover.append("circle")
                    .attr("r", 2);
                
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
                        d3.selectAll(".data-point, .date-heading").classed("current", false);
                    })
                    .on("mousemove", mousemove);


                var bisectDate = d3.bisector(function (d) { return d.parsed; }).left;

                function mousemove() {
                    var mouse = d3.mouse(this);
                    var date = x.invert(mouse[0]);
                    var lines = d3.selectAll(".line");
                    lines.each(function(otherSeries, row) {
                        // Update circle positions
                        var i = bisectDate(otherSeries, date, 1),
                            d0 = otherSeries[i - 1],
                            d1 = otherSeries[i],
                            d = date - d0.parsed > d1.parsed - date ? d1 : d0;
                        x.domain(d3.extent(otherSeries, function (d) {
                            return d.parsed;
                        }));
                        y.domain(d3.extent(otherSeries, function (d) {
                            return d.value;
                        }));
                        d3.select(this.parentNode).select(".hover")
                            .attr("transform", "translate(" + x(d.parsed) + "," + y(d.value) + ")");

                        // Update hover values
                        var hoverData = d3.selectAll(".hover-data")[0][row];
                        d3.select(hoverData).select(".hover-value").text(d.value);
                        d3.select(hoverData).select(".hover-unit").text(d.unit);

                        // Update table hover
                        d3.selectAll(".data-point, .date-heading").classed("current", false);
                        d3.selectAll("[data-date='"+d.dateIndex+"']").classed("current", true);

                        // Update index lines
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
    };
};

export default sparklineComponent;
