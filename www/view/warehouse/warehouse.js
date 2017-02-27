/**
 * Created by yangl on 2017/2/22.
 */
'use strict';
module.exports = angular.module("app.warehouse").controller("warehouseCtrl",['$state',function($state) {
    this.test = function() {
        alert(this.name);
    }
    if($state.is('warehouse')){
        $state.go('.home');
    }
}]).name;
