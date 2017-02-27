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
}).directive('clearInputBtn',function(){
    return {
        restrict:'EA',
        scope:{
            clearInputBtn:'='
        },
        link:function(scope,ele,attr,ngModeCtrl){
            $(ele).click(function(){
                scope.clearInputBtn='';
                scope.$apply();//执行比较
            })
        }
    }
}).directive('datePickSelect',function(){
    return {
        restrict:'EA',
        link:function(scope,ele,attrs){
            $(ele).datetimepicker({
                language:'zh-CN',
                autoclose:true,
                todayHighlight:true,
                format:'yyyy/mm/dd',
                weekStart:'1',
                todayBtn:true,
                forceParse:true,
                minView:'2'
            });
        }
    }
}).name;
/**
 * Created by yangl on 2017/2/22.
 */
