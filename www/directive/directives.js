'use strict';

module.exports = angular.module('directive.focusChangeLogo', []).directive('focusChangeLogo', function() {
    return {
        restrict: 'EA',
        scope:{
          className:'@',
            selector:'@',
            toggleSelector:'@'
        },
        link: function(scope, elem, attr) {

            $(elem).find(scope.selector).focus(function(){
                $(this).parent().find(scope.toggleSelector).addClass(scope.className);
            }).blur(function(){
                $(this).parent().find(scope.toggleSelector).removeClass(scope.className);
            })
        }
    };
}).name;
/**
 * Created by yangl on 2017/2/22.
 */
