'use strict';
module.exports = angular.module('directive.pickingDetail', []).directive('pickingDetail', function() {
    return {
        restrict: 'EA',
        template: require('./pickingDetail.html'),
        link: function($scope, elem, attr) {

        }
    };
}).name;
/**
 * Created by yangl on 2017/3/8.
 */
