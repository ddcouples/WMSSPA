'use strict';
module.exports = angular.module("app.storeMgmt").controller("takeStockCtrl", ['$scope',function($scope) {
    $scope.getOriginData={
      inventoryStatus:[{
          key:'0',
          value:'打开'
      },{
          key:'0',
          value:'生效'
      },{
          key:'0',
          value:'作业中'
      },{
          key:'0',
          value:'作业完成'
      }]
  }
    console.log('takeStockCtrl');
}]).name;
/**
 * Created by yangl on 2017/3/6.
 */
