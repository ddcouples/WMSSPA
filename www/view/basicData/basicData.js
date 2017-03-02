'use strict';
module.exports = angular.module("app.basicData").controller("basicDataCtrl",['$scope',function($scope) {

}]).controller("bdStoreMgmtCtrl", [ '$scope',function($scope) {
    $scope.getOriginData={
        storStatus:[{
            key:0,
            value:'打开'
        },{
            key:1,
            value:'关闭'
        }]
    }
}]).controller("bdReservoirMgmtCtrl", ['$scope',function($scope) {//
    $scope.getOriginData={
        reservoirStatus:[{
            key:0,
            value:'打开'
        },{
            key:1,
            value:'关闭'
        }]
    }
}])
    .controller("locationMgmtCtrl", ['$scope',function($scope) {//
        $scope.getOriginData={
            LocationStatus:[{
                key:0,
                value:'打开'
            },{
                key:1,
                value:'关闭'
            }]
        }
    }])
    .controller("platformMgmtCtrl", ['$scope',function($scope) {//月台管理路由器
        $scope.getOriginData={
            platformStatus:[{
                key:0,
                value:'打开'
            },{
                key:1,
                value:'关闭'
            }]
        }
    }])
    .controller("merchantsMgmtCtrl", ['$scope',function($scope) {//客商管理控制器
        $scope.getOriginData={
            merchantsStatus:[{
                key:0,
                value:'打开'
            },{
                key:1,
                value:'关闭'
            }]
        }
    }])
    .controller("itemTypeCtrl", ['$scope',function($scope) {//货品类型控制器

    }])
    .controller("bdGoodsMgmtCtrl", ['$scope',function($scope) {//货品管理控制器
        $scope.getOriginData={
            bgGoodsStatus:[{
                key:0,
                value:'打开'
            },{
                key:1,
                value:'生效'
            }]
        }
    }])
    .controller("bdPackagingMgmtCtrl", ['$scope',function($scope) {//包装管理控制器
        $scope.getOriginData={
            bdPackagingStatus:[{
                key:0,
                value:'打开'
            },{
                key:1,
                value:'生效'
            }]
        }
    }])
    .controller("locationSpecificationsCtrl", ['$scope',function($scope) {//库位规格控制器

    }])
    .controller("databaseSetupCtrl", ['$scope',function($scope) {//库容量设置控制器

    }])
    .controller("workspaceMgmtCtrl", ['$scope',function($scope) {//工作区管理控制器

    }])
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
