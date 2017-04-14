/**
 * Created by yangl on 2017/2/22.
 */
'use strict';
module.exports = angular.module('app.filters', [])
    .filter('substr', function(){
        return function(input,len,replace){
            if ( input == null || input == "" ) {
                return "";
            }
            var str = input;
            if ( input.length >= len+1 ) {
                str = input.substring(0,len)+replace;
            }
            return str;
        }
    })
    .filter('nullIsZero', ['$filter',function($filter){
        return function(input,length){
            if ( input == null || input == "" || input== undefined ) {
                return 0;
            }
            if(length){
                return $filter('number')(input,2);
            }
            return $filter('number')(input,length);
        }
    }])
    .name;