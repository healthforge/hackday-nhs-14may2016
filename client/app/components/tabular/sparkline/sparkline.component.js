import template from './sparkline.html';
import './sparkline.styl';
import d3 from 'd3';

let sparklineComponent = function ($compile, LabResultsService) {
    return {
        restrict: 'E',
        scope: {
            data: '=data'
        },
        template,
        link: function (scope, element, attrs) {
            var el = element[0].childNodes[0];
            scope.$watch('data', function (seriesData) {
                var margin = {top: 2, right: 2, bottom: 2, left: 2},
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

                focus.append("path")
                    .datum(seriesData)
                    .attr("class", "line")
                    .attr("d", pltLine);

                var hover = focus.append("g")
                    .attr("class", "focus")
                    .style("display", "none");

                hover.append("circle")
                    .attr("r", 4.5);

                hover.append("text")
                    .attr("x", 9)
                    .attr("dy", ".35em");

                focus.append("rect")
                    .attr("class", "overlay")
                    .attr("width", width)
                    .attr("height", height)
                    .on("mouseover", function () {
                        hover.style("display", null);
                        d3.selectAll(".mouse-line").style("opacity", "1")
                    })
                    .on("mouseout", function () {
                        hover.style("display", "none");
                        d3.selectAll(".mouse-line").style("opacity", "0")
                    })
                    .on("mousemove", mousemove);

                var mouseG = focus.append("g");

                mouseG.append("path")
                    .attr("class", "mouse-line")
                    .style("stroke", "black")
                    .style("stroke-width", "1px")
                    .style("opacity", "0");

                var bisectDate = d3.bisector(function (d) {
                    return d.parsed;
                }).left;

                function mousemove() {
                    var mouse = d3.mouse(this);
                    var x0 = x.invert(mouse[0]),
                        i = bisectDate(seriesData, x0, 1),
                        d0 = seriesData[i - 1],
                        d1 = seriesData[i],
                        d = x0 - d0.parsed > d1.parsed - x0 ? d1 : d0;
                    hover.attr("transform", "translate(" + x(d.parsed) + "," + y(d.value) + ")");
                    hover.select("text").text(d.value);
                    d3.selectAll(".mouse-line")
                        .attr("d", function () {
                            var d = "M" + mouse[0] + "," + height;
                            d += " " + mouse[0] + "," + 0;
                            return d;
                        });
                }
            });
        }
    };
};

sparklineComponent.$inject = ['$compile', 'LabResultsService'];

export default sparklineComponent;
