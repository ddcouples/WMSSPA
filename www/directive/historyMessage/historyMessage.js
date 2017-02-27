'use strict';

require('./historyMessage.scss');
module.exports = angular.module('directive.historyMessage', []).directive('historyMessage', function() {
    return {
        restrict: 'EA',
        template: require('./historyMessage.html'),
        link: function($scope, elem, attr) {}
    };
}).name;
