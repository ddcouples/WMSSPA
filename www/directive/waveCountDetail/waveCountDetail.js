'use strict';
module.exports = angular.module('directive.waveCountDetail', []).directive('waveCountDetail', function() {
    return {
        restrict: 'EA',
        template: require('./waveCountDetail.html'),
        link: function($scope, elem, attr) {

        }
    };
}).name;
/**
 * Created by yangl on 2017/3/8.
 */
