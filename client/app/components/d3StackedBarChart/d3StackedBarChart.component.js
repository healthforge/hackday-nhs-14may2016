import template from './d3StackedBarChart.html';
import './d3StackedBarChart.styl';
import d3 from 'd3';

let d3StackedBarChartComponent = function($compile) {
	return {
		scope: {
			val: '=',
			grouped: '=',
			data: '='
		},
		restrict: 'E',
		template,
		link: function(scope, element, attrs) {

			console.log("in directive link");

			var el = element[0].childNodes[0];

			var draw = function() {

				console.log("in directive draw");

				var data = scope.data;

				console.log(data);

				if(!data) {
					data = [4, 8, 15, 16, 23, 42];
				}

				var width = 420,
				    barHeight = 20;

				var x = d3.scale.linear()
				    .domain([0, d3.max(data)])
				    .range([0, width]);

				var chart = d3.select(el)
				    .attr("width", width)
				    .attr("height", barHeight * data.length);

				var current = chart.selectAll("g").remove();

				var bar = chart.selectAll("g")
				    .data(data)
				  .enter().append("g")
				    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

				bar.append("rect")
				    .attr("width", x)
				    .attr("height", barHeight - 1);

				bar.append("text")
				    .attr("x", function(d) { return x(d) - 3; })
				    .attr("y", barHeight / 2)
				    .attr("dy", ".35em")
				    .text(function(d) { return d; });

				$compile(el)(scope);
			};

			scope.$watch('data', draw);

			draw();
		}
	};
};

d3StackedBarChartComponent.$inject = ['$compile'];

export default d3StackedBarChartComponent;
