/**
 * Created by yangl on 2017/2/22.
 */
'use strict';
module.exports = angular.module("app.warehouse").controller("warehouseCtrl",['$state','$scope',function($state,$scope) {
    // this.test = function() {
    //     alert(this.name);
    // }
    // if($state.is('warehouse')){
    //     $state.go('.home');
    // }
    $scope.getWarehouseId='仓库1';
}]).name;
