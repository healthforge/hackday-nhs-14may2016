import template from './graphD3.html';
import './graphD3.styl';
import d3 from 'd3';

let graphD3Component = function($compile) {
	return {
		scope: {
			val: '=',
			grouped: '=',
			data: '='
		},
		restrict: 'E',
		template,
		link: function(scope, element, attrs) {
			var el = element[0].childNodes[0];
			var draw = function() {

				if(!scope.data.plt) {
					return;
				}
				var margin = {top: 10, right: 10, bottom: 100, left: 40},
					margin2 = {top: 430, right: 10, bottom: 20, left: 40},
					width = 960 - margin.left - margin.right,
					height = 500 - margin.top - margin.bottom,
					height2 = 500 - margin2.top - margin2.bottom;

				var x = d3.time.scale().range([0, width]),
					x2 = d3.time.scale().range([0, width]),
					y = d3.scale.linear().range([height, 0]),
					y2 = d3.scale.linear().range([height2, 0]);

				var xAxis = d3.svg.axis().scale(x).orient("bottom"),
					xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
					yAxis = d3.svg.axis().scale(y).orient("left");

				var pltLine = d3.svg.line()
					.x(function(d) { return x(d.parsed); })
					.y(function(d) { return y(d.value); });

				var brush = d3.svg.brush()
					.x(x2)
					.on("brush", brushed);

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

				var context = svg.append("g")
					.attr("class", "context")
					.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

				var parseDate = d3.time.format("%Y-%m-%dT%H:%M").parse;
				scope.data.plt.forEach(function(d) {
					d.parsed = parseDate(d.date);
					d.value = +d.value;
				});

				// Scale the range of the data
				x.domain(d3.extent(scope.data.plt, function(d) { return d.parsed; }));
				y.domain(d3.extent(scope.data.plt, function(d) { return d.value; }));
				x2.domain(x.domain());
				y2.domain(y.domain());

				focus.append("path")
					.datum(scope.data.plt)
					.attr("class", "line")
					.attr("d", pltLine);

				// Add the X Axis
				focus.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);

				// Add the Y Axis
				focus.append("g")
					.attr("class", "y axis")
					.call(yAxis);

				var area = d3.svg.area()
					.interpolate("monotone")
					.x(function(d) { return x2(d.parsed); })
					.y0(height2)
					.y1(function(d) { return y2(d.value); });
				context.append("path")
					.datum(scope.data.plt)
					.attr("class", "area")
					.attr("d", area);

				context.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height2 + ")")
					.call(xAxis2);

				context.append("g")
					.attr("class", "x brush")
					.call(brush)
					.selectAll("rect")
					.attr("y", -6)
					.attr("height", height2 + 7);

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
					.on("mouseover", function() { hover.style("display", null); })
					.on("mouseout", function() { hover.style("display", "none"); })
					.on("mousemove", mousemove);

				var bisectDate = d3.bisector(function(d) { return d.parsed; }).left;
				function mousemove() {
					var x0 = x.invert(d3.mouse(this)[0]),
						i = bisectDate(scope.data.plt, x0, 1),
						d0 = scope.data.plt[i - 1],
						d1 = scope.data.plt[i],
						d = x0 - d0.parsed > d1.parsed - x0 ? d1 : d0;
					hover.attr("transform", "translate(" + x(d.parsed) + "," + y(d.value) + ")");
					hover.select("text").text(d.value);
				}

				function brushed() {
					x.domain(brush.empty() ? x2.domain() : brush.extent());
					focus.select(".line").attr("d", pltLine(scope.data.plt));
					focus.select(".x.axis").call(xAxis);
				}

			};
			scope.$watch('data', draw, true);
		}
	};
};

graphD3Component.$inject = ['$compile'];

export default graphD3Component;
