'use strict';

module.exports = angular.module('directive.putawayListDetail', []).directive('putawayListDetail', function() {
    return {
        restrict: 'EA',
        template: require('./putawayListDetail.html'),
        link: function($scope, elem, attr) {

        }
    };
}).name;
