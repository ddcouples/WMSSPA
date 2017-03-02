'use strict';
module.exports = angular.module("app.sysSetting").controller("sysSettingCtrl",['$state',function($state) {
    console.log('sysSettingCtrl');

    this.test = function() {
        alert(this.name);
    }
}]).controller("epManagementCtrl", ['$scope',function($scope) {
    $scope.getOriginData={
        epManagemenStatus:[
            {
                key:'1',
                value:'打开'
            },{
                key:'02',
                value:'生效'
            }]
    }
}]).controller("rightsMgmtCtrl", ['$scope',function($scope) { //权限管理控制器
    $scope.getOriginData={
        rightsStatus:[
            {
                key:'1',
                value:'打开'
            },{
                key:'02',
                value:'生效'
            },{
                key:'03',
                value:'部分拣货'
            },{
                key:'04',
                value:'已拣货'
            },{
                key:'05',
                value:'部分发运'
            },{
                key:'06',
                value:'已发运'
            }
        ]
        // asnStatusLis:[
        //
        //     {
        //         key:'1',
        //         value:'打开'
        //     },{
        //         key:'02',
        //         value:'生效'
        //     },{
        //         key:'03',
        //         value:'取消'
        //     },{
        //         key:'04',
        //         value:'部分收货'
        //     },{
        //         key:'05',
        //         value:'已收货'
        //     },{
        //         key:'06',
        //         value:'部分上架'
        //     },{
        //         key:'07',
        //         value:'已上架'
        //     }
        // ]
    }
}])
    .controller("roleMgmtCtrl", ['$scope',function($scope) { //权限管理控制器
        $scope.getOriginData={
            roleStatus:[
                {
                    key:'1',
                    value:'打开'
                },{
                    key:'02',
                    value:'生效'
                },{
                    key:'03',
                    value:'部分拣货'
                },{
                    key:'04',
                    value:'已拣货'
                },{
                    key:'05',
                    value:'部分发运'
                },{
                    key:'06',
                    value:'已发运'
                }
            ]

        }
    }])
    .controller("usersMgmtCtrl", ['$scope',function($scope) { //用户管理控制器
        $scope.getOriginData={
            usersMgmtStatus:[
                {
                    key:'1',
                    value:'打开'
                },{
                    key:'02',
                    value:'生效'
                }]
        }
    }])
    .controller("peopleMgmtCtrl", ['$scope',function($scope) { //人员管理控制器
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
    }])
    .controller("reportConfig", ['$scope',function($scope) { //报表配置控制器
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
    }])
    .controller("globalParameterCtrl", ['$scope',function($scope) { //全局参数控制器
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
    }]).controller("interfaceMgmtCtrl", ['$scope',function($scope) { //接口管理控制器
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
    }]).controller("operationLogCtrl", ['$scope',function($scope) { //操作日志控制器
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
    }]).controller("inventoryLogCtrl", ['$scope',function($scope) { //操作日志控制器
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
    }])
    .name;
