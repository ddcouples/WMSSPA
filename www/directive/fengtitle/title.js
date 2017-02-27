'use strict';

require('./title.scss');
module.exports = angular.module('directive.historyMessage', []).directive('historyMessage', function() {
    return {
        restrict: 'EA',
        scope:{
            source:'='
        },
        template: require('./historyMessage.html'),
        link: function($scope, elem, attr) {

        }
    };
}).name;
