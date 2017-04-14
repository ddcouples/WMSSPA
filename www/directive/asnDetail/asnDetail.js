'use strict';
module.exports = angular.module('directive.asnDetail', []).directive('asnDetail', function() {
    return {
        restrict: 'EA',
        template: require('./asnDetail.html')
    };
}).name;
