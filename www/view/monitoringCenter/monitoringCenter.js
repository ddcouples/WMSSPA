'use strict';
module.exports = angular.module("app.monitoringCenter").controller("monitoringCenterCtrl",['$state',function($state) {

    this.test = function() {
        alert(this.name);
    }
}]).controller("exceptionMgmtCtrl", [function() {
    console.log('exceptionMgmtCtrl');
    this.test = function() {
        alert(this.name);
    }
}]).controller("inventoryWarningCtrl", ['$scope',function($scope) {
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
}]).name;
