
'use strict';
module.exports = angular.module("app.sysSetting").controller("inventoryLogCtrl", ['$scope',function($scope) { //操作日志控制器
    $scope.getOriginData={
        peopleStatus:[
            {
                key:'1',
                value:'打开'
            },{
                key:'02',
                value:'生效'
            }]
    }
}]).name;
/**
 * Created by yangl on 2017/3/6.
 */


