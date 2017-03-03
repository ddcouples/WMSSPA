'use strict';
module.exports = angular.module('directive.searchModal', []).directive('searchModal', function() {
    return {
        restrict: 'EA',
        scope:{

        },
        replace:true,
        template: require('./searchModal.html'),
        link: function($scope, elem, attr) {

        }
    };
}).name;
/**
 * Created by yangl on 2017/3/3.
 */
