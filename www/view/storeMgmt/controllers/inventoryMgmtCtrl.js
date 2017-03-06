'use strict';
module.exports = angular.module("app.storeMgmt").controller("inventoryMgmtCtrl", ['$scope',function($scope) {
    $scope.getOriginData={
        storStatusLists:[{
            key:0,
            value:'合格'
        },{
            key:1,
            value:'不合格'
        },{
            key:2,
            value:'代建合格'
        }],
        freezeStatusLists:[{
            key:0,
            value:'是'
        },{
            key:1,
            value:'否'
        }]
    }
    console.log('inventoryMgmtCtrl');
}]).name;
/**
 * Created by yangl on 2017/3/6.
 */
