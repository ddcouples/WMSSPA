'use strict';
module.exports = angular.module('directive.footer', []).directive('footer', function() {
    return {
        restrict: 'EA',
        replace:true,
        template: require('./footer.html'),
        link: function($scope, elem, attr) {

        }
    };
}).name;
/**
 * Created by yangl on 2017/3/3.
 */
