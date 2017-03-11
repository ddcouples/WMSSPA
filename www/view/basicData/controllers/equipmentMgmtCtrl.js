
'use strict';
module.exports = angular.module("app.basicData")
    .controller("equipmentMgmtCtrl", ['$scope',function($scope) {//设备管理控制器
        $scope.getOriginData={
            equipmentStatus:[{
                key:0,
                value:'打开'
            },{
                key:1,
                value:'生效'
            }]
        }
    }])
    .name;
/**
 * Created by yangl on 2017/3/6.
 */
