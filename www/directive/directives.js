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
})
    //只能输入数字  兼容ie chrome 火狐
    .directive('inputNumberOnly',function(){
    return {
        restrict:'A',
        scope:{
           ngModel:'=',
            max:'@',
            min:'@',
            nonzeroInteger:'@'
        },
        require:'ngModel',
        link:function(scope,ele,attr,ngModeCtrl){
            scope.dot=true;
            scope.$watch('ngModel',function(newV){
                if(!newV) return;
                if(scope.ngModel.toString().indexOf('.')!=-1){
                    scope.dot=false;
                }else{
                    scope.dot=true;
                }
                var _value=newV.toString();
                _value=_value.replace(/[^\d\.]/g,'');
                if((/[\u4e00-\u9fa5]+/).test(_value)){
                    _value=_value.replace(/[\u4e00-\u9fa5]+/g,''); // 如果有汉字就替换成空
                }
                if(_value.length>1&&_value[0]=='0'&&(_value[1]=='0')){
                    _value=_value.substring(2, _value.length);
                }else if(_value.length>1&&_value[0]=='0'&&(_value[1]!='.')){
                    _value=_value.substring(1, _value.length);
                }
                scope.ngModel=_value;
                // scope.$apply();
                if(scope.max){
                    var _max=scope.max;
                    if(parseFloat(_value)>parseFloat(_max)){
                        console.log(_value);
                        scope.ngModel=_max;
                        // scope.$apply();
                    }
                    return;
                }
                if(scope.min){
                    var _min=scope.min;
                    if(!scope.ngModel||scope.ngModel==''||parseFloat(_min)>parseFloat(_value)){
                        scope.ngModel=_min;
                        // scope.$apply();
                    }
                }

            });
            $(ele).keypress(function(event) {
                var keyCode = event.which;
                if(scope.nonzeroInteger&&keyCode == 46){
                    console.log('必须是整形');
                    return false;
                }
                if (keyCode == 46 ||keyCode == 2|| (keyCode >= 48 && keyCode <=57)){
                    if(!scope.dot&&keyCode == 46 ) return false;
                    return true;
                }
                else{
                    return false;
                }
            }).focus(function() {
                if(this.value==0){
                    scope.ngModel="";
                    scope.$apply();
                }
                this.style.imeMode='disabled';
            }).bind('input propertychange change',function(){

            }).blur(function() {
                if(this.value==''){
                    scope.ngModel=0;
                    scope.$apply();
                }
            })
        }
    }
})
    //调整到最大值
    .directive('turnToMax',function(){
        return {
            restrict:'A',
            scope:{
                max:'@',
                turnToMax:'='
            },
            link:function(scope,ele,attr,ngModeCtrl){
                $(ele).click(function(){
                   if(scope.max){
                       scope.turnToMax=scope.max;
                       scope.$apply();
                   }
                })
            }
        }
    })
    .directive('turnToMin',function(){
        return {
            restrict:'A',
            scope:{
                min:'@',
                turnToMin:'='
            },
            link:function(scope,ele,attr,ngModeCtrl){
                $(ele).click(function(){
                    if(scope.min){
                        scope.turnToMin=scope.min;
                        scope.$apply();
                    }
                })
            }
        }
    })
    .directive('datePickSelect',function(){
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
})
    .name;
/**
 * Created by yangl on 2017/2/22.
 */
