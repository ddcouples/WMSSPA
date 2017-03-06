'use strict';
module.exports = angular.module("app.storeMgmt").controller("profitLossAdjustmentCtrl", ['$scope',function($scope) {
    $scope.getOriginData={
        AdjustStatus:[{
            key:'0',
            value:'打开'
        },{
            key:'0',
            value:'已调帐'
        },{
            key:'0',
            value:'取消'
        }]
    }
    console.log('profitLossAdjustmentCtrl');
}]).name;
/**
 * Created by yangl on 2017/3/6.
 */
