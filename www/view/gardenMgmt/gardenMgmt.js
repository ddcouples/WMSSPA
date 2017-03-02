'use strict';
module.exports = angular.module("app.gardenMgmt").controller("gardenMgmtCtrl",['$state',function($state) {

    this.test = function() {
        alert(this.name);
    }
}]).controller("rentalMgmtCtrl", ['$scope',function($scope) {
    $scope.getOriginData={
        rentalStatus:[{
            key:'0',
            value:'打开'
        },{
            key:'0',
            value:'生效'
        }]
    }
}]).controller("leaseWarningCtrl", [function() {

}]).controller("businessStatisticsCtrl", ['$scope',function($scope) {
    $scope.getOriginData={
        businessStates:[{
            key:'0',
            value:'采购订单'
        },{
            key:'0',
            value:'生产订单'
        },{
            key:'0',
            value:'调拨订单'
        },{
            key:'0',
            value:'销售订单'
        },{
            key:'0',
            value:'其他'
        }]
    }
}]).name;
