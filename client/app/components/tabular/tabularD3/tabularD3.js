import angular from 'angular';
import uiRouter from 'angular-ui-router';
import tabularD3Component from './tabularD3.component';

let tabularD3Module = angular.module('tabularD3', [
        uiRouter
    ])
    .directive('tabularD3', tabularD3Component);

export default tabularD3Module;
