/**
 * Created by yangl on 2017/3/7.
 */
'use strict';
module.exports = angular.module('directive.deliveryDetail', []).directive('deliveryDetail', function() {
    return {
        restrict: 'EA',
        template: require('./deliveryDetail.html'),
        link: function($scope, elem, attr) {

        }
    };
}).name;
