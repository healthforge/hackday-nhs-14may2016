import angular from 'angular';
import uiRouter from 'angular-ui-router';
import d3StackedBarChartComponent from './d3StackedBarChart.component';

let d3StackedBarChartModule = angular.module('d3StackedBarChart', [
  uiRouter
])
.directive('d3StackedBarChart', d3StackedBarChartComponent);


export default d3StackedBarChartModule;
